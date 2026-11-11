import { useMemo, useState } from 'react'

import { PageHeader } from '@/components/layout/PageHeader'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { ConfirmDialog, Modal } from '@/components/ui/Modal'
import { LoadingState } from '@/components/ui/Spinner'
import { MortgageBrokerFiltersBar } from '@/features/mortgageBrokers/components/MortgageBrokerFiltersBar'
import { MortgageBrokerForm } from '@/features/mortgageBrokers/components/MortgageBrokerForm'
import {
  collectMortgageBrokerCountries,
  filterMortgageBrokers,
  hasMortgageBrokerCriteria,
} from '@/features/mortgageBrokers/filters'
import {
  useCreateMortgageBroker,
  useDeleteMortgageBroker,
  useMortgageBrokers,
  useUpdateMortgageBroker,
} from '@/features/mortgageBrokers/hooks/useMortgageBrokers'
import { toErrorMessage } from '@/lib/utils'
import { MortgageBrokerTable } from '@/pages/MortgageBrokersPage/MortgageBrokerTable'
import {
  EMPTY_MORTGAGE_BROKER_FILTERS,
  type MortgageBroker,
  type MortgageBrokerFilters,
  type MortgageBrokerInput,
} from '@/types/models'

export function MortgageBrokersPage() {
  const { data: brokers, isLoading, isError, error, refetch } = useMortgageBrokers()

  const createBroker = useCreateMortgageBroker()
  const updateBroker = useUpdateMortgageBroker()
  const deleteBroker = useDeleteMortgageBroker()

  const [filters, setFilters] = useState<MortgageBrokerFilters>(EMPTY_MORTGAGE_BROKER_FILTERS)
  const [editing, setEditing] = useState<MortgageBroker | null>(null)
  const [isFormOpen, setFormOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<MortgageBroker | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const countries = useMemo(() => collectMortgageBrokerCountries(brokers ?? []), [brokers])
  const visibleBrokers = useMemo(
    () => filterMortgageBrokers(brokers ?? [], filters),
    [brokers, filters],
  )

  const hasCriteria = hasMortgageBrokerCriteria(filters)

  const openCreate = () => {
    setActionError(null)
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (broker: MortgageBroker) => {
    setActionError(null)
    setEditing(broker)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
  }

  const handleSubmit = async (input: MortgageBrokerInput) => {
    setActionError(null)
    if (editing) {
      await updateBroker.mutateAsync({ id: editing.id, input })
    } else {
      await createBroker.mutateAsync(input)
    }
    closeForm()
  }

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return
    setActionError(null)
    try {
      await deleteBroker.mutateAsync(pendingDelete.id)
    } catch (deleteError) {
      setActionError(toErrorMessage(deleteError))
    } finally {
      setPendingDelete(null)
    }
  }

  return (
    <>
      <PageHeader
        title="Mortgage Brokers"
        description="The mortgage brokers you can use to finance your deals."
        actions={<Button onClick={openCreate}>New mortgage broker</Button>}
      />

      {actionError && <Alert className="mb-4">{actionError}</Alert>}

      <Card>
        <MortgageBrokerFiltersBar
          filters={filters}
          countries={countries}
          onChange={(patch) => setFilters((previous) => ({ ...previous, ...patch }))}
        />

        {isLoading ? (
          <LoadingState label="Loading mortgage brokers…" />
        ) : isError ? (
          <ErrorState description={toErrorMessage(error)} onRetry={() => void refetch()} />
        ) : visibleBrokers.length === 0 ? (
          <EmptyState
            title={hasCriteria ? 'No mortgage brokers match your filters' : 'No mortgage brokers yet'}
            description={
              hasCriteria
                ? 'Try a different name or country.'
                : 'Add the mortgage brokers you can use so you can keep their details handy.'
            }
            actionLabel={hasCriteria ? undefined : 'Add a mortgage broker'}
            onAction={hasCriteria ? undefined : openCreate}
          />
        ) : (
          <MortgageBrokerTable
            brokers={visibleBrokers}
            totalCount={brokers?.length ?? 0}
            onEdit={openEdit}
            onDelete={setPendingDelete}
          />
        )}
      </Card>

      <Modal
        open={isFormOpen}
        onClose={closeForm}
        title={editing ? 'Edit mortgage broker' : 'New mortgage broker'}
        description={editing ? editing.name : 'Add a mortgage broker to your directory.'}
      >
        <MortgageBrokerForm
          broker={editing}
          submitting={createBroker.isPending || updateBroker.isPending}
          submitLabel={editing ? 'Save changes' : 'Create mortgage broker'}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete mortgage broker"
        message={
          <>
            Delete <strong>{pendingDelete?.name}</strong>? This cannot be undone.
          </>
        }
        loading={deleteBroker.isPending}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}
