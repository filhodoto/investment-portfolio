import { useMemo, useState } from 'react'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { ConfirmDialog, Modal } from '@/components/ui/Modal'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { LoadingState } from '@/components/ui/Spinner'
import { InvestmentFiltersBar } from '@/features/investments/components/InvestmentFiltersBar'
import { InvestmentForm } from '@/features/investments/components/InvestmentForm'
import { InvestmentTable } from '@/features/investments/components/InvestmentTable'
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

  const { data: investments, isLoading, isError, error, refetch, isFetching } = useInvestments(filters)
  const { data: lawyers = [] } = useLawyers()

  const createInvestment = useCreateInvestment()
  const updateInvestment = useUpdateInvestment()
  const deleteInvestment = useDeleteInvestment()

  // Sorting is not a filter, so it does not count as "filtered".
  const hasCriteria = useMemo(
    () =>
      filters.search !== '' ||
      filters.typology !== 'all' ||
      filters.status !== 'all' ||
      filters.lawyerId !== 'all' ||
      filters.minPrice !== '' ||
      filters.maxPrice !== '',
    [filters],
  )

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

      {actionError && (
        <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200 ring-inset dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-900">
          {actionError}
        </p>
      )}

      <Card>
        <InvestmentFiltersBar
          filters={filters}
          lawyers={lawyers}
          onChange={(patch) => setFilters((previous) => ({ ...previous, ...patch }))}
        />

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
            onAction={
              hasCriteria
                ? () =>
                    setFilters((previous) => ({
                      ...previous,
                      search: '',
                      typology: 'all',
                      status: 'all',
                      lawyerId: 'all',
                      minPrice: '',
                      maxPrice: '',
                    }))
                : openCreate
            }
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
        description={
          editing ? editing.title : 'File the details of a property you are considering.'
        }
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

function PlusIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden>
      <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
    </svg>
  )
}
