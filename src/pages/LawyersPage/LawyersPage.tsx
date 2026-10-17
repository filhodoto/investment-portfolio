import { useMemo, useState } from 'react'

import { PageHeader } from '@/components/layout/PageHeader'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { ConfirmDialog, Modal } from '@/components/ui/Modal'
import { LoadingState } from '@/components/ui/Spinner'
import { useInvestments } from '@/features/investments/hooks/useInvestments'
import { LawyerFiltersBar } from '@/features/lawyers/components/LawyerFiltersBar'
import { LawyerForm } from '@/features/lawyers/components/LawyerForm'
import {
  collectLawyerCountries,
  countInvestmentsByLawyer,
  filterLawyers,
  hasLawyerCriteria,
} from '@/features/lawyers/filters'
import {
  useCreateLawyer,
  useDeleteLawyer,
  useLawyers,
  useUpdateLawyer,
} from '@/features/lawyers/hooks/useLawyers'
import { toErrorMessage } from '@/lib/utils'
import { LawyerTable } from '@/pages/LawyersPage/LawyerTable'
import {
  EMPTY_FILTERS,
  EMPTY_LAWYER_FILTERS,
  type Lawyer,
  type LawyerFilters,
  type LawyerInput,
} from '@/types/models'

export function LawyersPage() {
  const { data: lawyers, isLoading, isError, error, refetch } = useLawyers()
  const { data: investments = [] } = useInvestments(EMPTY_FILTERS)

  const createLawyer = useCreateLawyer()
  const updateLawyer = useUpdateLawyer()
  const deleteLawyer = useDeleteLawyer()

  const [filters, setFilters] = useState<LawyerFilters>(EMPTY_LAWYER_FILTERS)
  const [editing, setEditing] = useState<Lawyer | null>(null)
  const [isFormOpen, setFormOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Lawyer | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const investmentCounts = useMemo(() => countInvestmentsByLawyer(investments), [investments])
  const countries = useMemo(() => collectLawyerCountries(lawyers ?? []), [lawyers])
  const visibleLawyers = useMemo(() => filterLawyers(lawyers ?? [], filters), [lawyers, filters])

  const hasCriteria = hasLawyerCriteria(filters)

  const openCreate = () => {
    setActionError(null)
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (lawyer: Lawyer) => {
    setActionError(null)
    setEditing(lawyer)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
  }

  const handleSubmit = async (input: LawyerInput) => {
    setActionError(null)
    if (editing) {
      await updateLawyer.mutateAsync({ id: editing.id, input })
    } else {
      await createLawyer.mutateAsync(input)
    }
    closeForm()
  }

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return
    setActionError(null)
    try {
      await deleteLawyer.mutateAsync(pendingDelete.id)
    } catch (deleteError) {
      setActionError(toErrorMessage(deleteError))
    } finally {
      setPendingDelete(null)
    }
  }

  return (
    <>
      <PageHeader
        title="Lawyers"
        description="The lawyers you work with. Link them to investments to keep track of who is on what."
        actions={<Button onClick={openCreate}>New lawyer</Button>}
      />

      {actionError && <Alert className="mb-4">{actionError}</Alert>}

      <Card>
        <LawyerFiltersBar
          filters={filters}
          countries={countries}
          onChange={(patch) => setFilters((previous) => ({ ...previous, ...patch }))}
        />

        {isLoading ? (
          <LoadingState label="Loading lawyers…" />
        ) : isError ? (
          <ErrorState description={toErrorMessage(error)} onRetry={() => void refetch()} />
        ) : visibleLawyers.length === 0 ? (
          <EmptyState
            title={hasCriteria ? 'No lawyers match your filters' : 'No lawyers yet'}
            description={
              hasCriteria
                ? 'Try a different name, country or office.'
                : 'Add the lawyers you work with so you can attach them to deals.'
            }
            actionLabel={hasCriteria ? undefined : 'Add a lawyer'}
            onAction={hasCriteria ? undefined : openCreate}
          />
        ) : (
          <LawyerTable
            lawyers={visibleLawyers}
            totalCount={lawyers?.length ?? 0}
            investmentCounts={investmentCounts}
            onEdit={openEdit}
            onDelete={setPendingDelete}
          />
        )}
      </Card>

      <Modal
        open={isFormOpen}
        onClose={closeForm}
        title={editing ? 'Edit lawyer' : 'New lawyer'}
        description={editing ? editing.name : 'Add a lawyer to your directory.'}
      >
        <LawyerForm
          lawyer={editing}
          submitting={createLawyer.isPending || updateLawyer.isPending}
          submitLabel={editing ? 'Save changes' : 'Create lawyer'}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete lawyer"
        message={
          <>
            Delete <strong>{pendingDelete?.name}</strong>? Investments linked to them will keep their
            details but lose the lawyer association.
          </>
        }
        loading={deleteLawyer.isPending}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}
