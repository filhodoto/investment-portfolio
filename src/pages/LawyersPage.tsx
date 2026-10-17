import { useMemo, useState } from 'react'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { ConfirmDialog, Modal } from '@/components/ui/Modal'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { LoadingState } from '@/components/ui/Spinner'
import { LawyerFiltersBar } from '@/features/lawyers/components/LawyerFiltersBar'
import { LawyerForm } from '@/features/lawyers/components/LawyerForm'
import {
  useCreateLawyer,
  useDeleteLawyer,
  useLawyers,
  useUpdateLawyer,
} from '@/features/lawyers/hooks/useLawyers'
import { useInvestments } from '@/features/investments/hooks/useInvestments'
import { toErrorMessage } from '@/lib/utils'
import { EMPTY_FILTERS, EMPTY_LAWYER_FILTERS, type Lawyer, type LawyerFilters, type LawyerInput } from '@/types/models'

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

  /** lawyer id -> number of investments linked to them */
  const investmentCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const investment of investments) {
      if (!investment.lawyer_id) continue
      counts.set(investment.lawyer_id, (counts.get(investment.lawyer_id) ?? 0) + 1)
    }
    return counts
  }, [investments])

  /** Distinct countries across every lawyer — powers the country dropdown. */
  const countries = useMemo(() => {
    const seen = new Set<string>()
    for (const lawyer of lawyers ?? []) {
      if (lawyer.country) seen.add(lawyer.country)
    }
    return [...seen].sort((a, b) => a.localeCompare(b))
  }, [lawyers])

  const filteredLawyers = useMemo(() => {
    const term = filters.search.trim().toLowerCase()
    return (lawyers ?? []).filter((lawyer) => {
      if (filters.country !== 'all' && lawyer.country !== filters.country) return false
      if (!term) return true
      return [lawyer.name, lawyer.email, lawyer.office, lawyer.phone, lawyer.country]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term))
    })
  }, [lawyers, filters])

  const hasCriteria = filters.search !== '' || filters.country !== 'all'

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

      {actionError && (
        <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200 ring-inset dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-900">
          {actionError}
        </p>
      )}

      <Card>
        <LawyerFiltersBar filters={filters} countries={countries} onChange={(patch) => setFilters((previous) => ({ ...previous, ...patch }))} />

        {isLoading ? (
          <LoadingState label="Loading lawyers…" />
        ) : isError ? (
          <ErrorState description={toErrorMessage(error)} onRetry={() => void refetch()} />
        ) : filteredLawyers.length === 0 ? (
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[54rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase dark:border-slate-800 dark:text-slate-400">
                  <th scope="col" className="px-5 py-3">Name</th>
                  <th scope="col" className="px-4 py-3">Contact</th>
                  <th scope="col" className="px-4 py-3">Office</th>
                  <th scope="col" className="px-4 py-3">Country</th>
                  <th scope="col" className="px-4 py-3 text-right">Deals</th>
                  <th scope="col" className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {filteredLawyers.map((lawyer) => {
                  const count = investmentCounts.get(lawyer.id) ?? 0
                  return (
                    <tr
                      key={lawyer.id}
                      className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-5 py-3">
                        <p className="font-medium text-slate-900 dark:text-slate-100">{lawyer.name}</p>
                        {lawyer.notes && (
                          <p className="mt-0.5 line-clamp-1 max-w-72 text-xs text-slate-500 dark:text-slate-400">
                            {lawyer.notes}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          {lawyer.email ? (
                            <a
                              href={`mailto:${lawyer.email}`}
                              className="text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                            >
                              {lawyer.email}
                            </a>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500">—</span>
                          )}
                          {lawyer.phone && (
                            <span className="text-xs text-slate-500 dark:text-slate-400">{lawyer.phone}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {lawyer.office ?? <span className="text-slate-400 dark:text-slate-500">—</span>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                        {lawyer.country ?? <span className="text-slate-400 dark:text-slate-500">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {count > 0 ? (
                          <span className="font-medium text-indigo-600 dark:text-indigo-400">{count}</span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">0</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(lawyer)}>
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/50 dark:hover:text-rose-300"
                            onClick={() => setPendingDelete(lawyer)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <CardBody className="border-t border-slate-200 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
              Showing {filteredLawyers.length} of {lawyers?.length ?? 0} lawyers. Deleting a lawyer
              keeps their investments — the link is simply cleared.
            </CardBody>
          </div>
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
