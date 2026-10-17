import { useState } from 'react'

import { PlusIcon } from '@/components/icons'
import { PageHeader } from '@/components/layout/PageHeader'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { ConfirmDialog, Modal } from '@/components/ui/Modal'
import { LoadingState } from '@/components/ui/Spinner'
import { InvestmentFiltersBar } from '@/features/investments/components/InvestmentFiltersBar'
import { InvestmentForm } from '@/features/investments/components/InvestmentForm'
import { InvestmentTable } from '@/features/investments/components/InvestmentTable'
import { clearInvestmentCriteria, hasInvestmentCriteria } from '@/features/investments/filters'
import { useInvestmentQueryFilters } from '@/features/investments/hooks/useInvestmentQueryFilters'
import {
  useCreateInvestment,
  useDeleteInvestment,
  useInvestments,
  useUpdateInvestment,
} from '@/features/investments/hooks/useInvestments'
import { useLawyers } from '@/features/lawyers/hooks/useLawyers'
import { toErrorMessage } from '@/lib/utils'
import {
  EMPTY_FILTERS,
  type Investment,
  type InvestmentFilters,
  type InvestmentInput,
  type InvestmentSortField,
} from '@/types/models'

export function InvestmentsPage() {
  const [filters, setFilters] = useState<InvestmentFilters>(EMPTY_FILTERS)
  const [editing, setEditing] = useState<Investment | null>(null)
  const [isFormOpen, setFormOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Investment | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  // Text entry is debounced for the query; the inputs themselves stay instant.
  const queryFilters = useInvestmentQueryFilters(filters)
  const { data: investments, isLoading, isError, error, refetch, isFetching } =
    useInvestments(queryFilters)
  const { data: lawyers = [] } = useLawyers()

  const createInvestment = useCreateInvestment()
  const updateInvestment = useUpdateInvestment()
  const deleteInvestment = useDeleteInvestment()

  const patchFilters = (patch: Partial<InvestmentFilters>) => {
    setFilters((previous) => ({ ...previous, ...patch }))
  }

  // Sorting is not a filter, so it does not count as "filtered".
  const hasCriteria = hasInvestmentCriteria(filters)

  /** Clicking a header toggles direction; a new column starts ascending (desc for dates). */
  const handleSort = (field: InvestmentSortField) => {
    setFilters((previous) =>
      previous.sort === field
        ? { ...previous, direction: previous.direction === 'asc' ? 'desc' : 'asc' }
        : { ...previous, sort: field, direction: field === 'created_at' ? 'desc' : 'asc' },
    )
  }

  const openCreate = () => {
    setActionError(null)
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (investment: Investment) => {
    setActionError(null)
    setEditing(investment)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
  }

  const handleSubmit = async (input: InvestmentInput) => {
    setActionError(null)
    if (editing) {
      await updateInvestment.mutateAsync({ id: editing.id, input })
    } else {
      await createInvestment.mutateAsync(input)
    }
    closeForm()
  }

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return
    setActionError(null)
    try {
      await deleteInvestment.mutateAsync(pendingDelete.id)
      setPendingDelete(null)
    } catch (deleteError) {
      setActionError(toErrorMessage(deleteError))
      setPendingDelete(null)
    }
  }

  return (
    <>
      <PageHeader
        title="Investments"
        description="Every property you are researching, negotiating on or holding."
        actions={
          <Button onClick={openCreate} icon={<PlusIcon />}>
            New investment
          </Button>
        }
      />

      {actionError && <Alert className="mb-4">{actionError}</Alert>}

      <Card>
        <InvestmentFiltersBar filters={filters} lawyers={lawyers} onChange={patchFilters} />

        {isLoading ? (
          <LoadingState label="Loading investments…" />
        ) : isError ? (
          <ErrorState description={toErrorMessage(error)} onRetry={() => void refetch()} />
        ) : !investments || investments.length === 0 ? (
          <EmptyState
            title={hasCriteria ? 'No investments match your filters' : 'No investments yet'}
            description={
              hasCriteria
                ? 'Try widening the price range or clearing the filters above.'
                : 'File your first property to start tracking prices, lawyers and expected earnings.'
            }
            actionLabel={hasCriteria ? 'Clear filters' : 'Add an investment'}
            onAction={hasCriteria ? () => patchFilters(clearInvestmentCriteria()) : openCreate}
          />
        ) : (
          <>
            <InvestmentTable
              investments={investments}
              sort={filters.sort}
              direction={filters.direction}
              onSort={handleSort}
              onEdit={openEdit}
              onDelete={setPendingDelete}
            />
            <CardBody className="flex items-center justify-between border-t border-slate-200 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <span>
                {investments.length} {investments.length === 1 ? 'investment' : 'investments'}
              </span>
              {isFetching && <span>Refreshing…</span>}
            </CardBody>
          </>
        )}
      </Card>

      <Modal
        open={isFormOpen}
        onClose={closeForm}
        size="lg"
        title={editing ? 'Edit investment' : 'New investment'}
        description={editing ? editing.title : 'File the details of a property you are considering.'}
      >
        <InvestmentForm
          investment={editing}
          submitting={createInvestment.isPending || updateInvestment.isPending}
          submitLabel={editing ? 'Save changes' : 'Create investment'}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete investment"
        message={
          <>
            Are you sure you want to delete <strong>{pendingDelete?.title}</strong>? This cannot be
            undone.
          </>
        }
        loading={deleteInvestment.isPending}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}
