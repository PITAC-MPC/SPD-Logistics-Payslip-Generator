import { useEffect, useMemo, useState } from 'react';
import AppBar from './components/app/AppBar';
import StatusToast from './components/app/StatusToast';
import HelpersSection from './components/payslip/HelpersSection';
import PayslipHeader from './components/payslip/PayslipHeader';
import TripsSection from './components/payslip/TripsSection';
import useGridNavigation from './hooks/useGridNavigation';
import usePayslip from './hooks/usePayslip';
import { computePayslip } from './lib/calculations';
import { buildPdfFileName } from './lib/format';
import PrintPayslip from './print/PrintPayslip';

export default function App() {
  const {
    state,
    updateMeta,
    updateTrip,
    addTrip,
    removeTrip,
    updateDeduction,
    addDeduction,
    removeDeduction,
    updateHelper,
    addHelper,
    removeHelper,
    updateHelperDeduction,
    addHelperDeduction,
    removeHelperDeduction,
    reset,
  } = usePayslip();

  const totals = useMemo(() => computePayslip(state), [state]);

  useGridNavigation({
    onAddRow: (section, rowType) => {
      if (section === 'trips') {
        if (rowType === 'deduction') addDeduction();
        else addTrip();
      } else if (section === 'helpers') {
        if (rowType === 'deduction') addHelperDeduction();
        else addHelper();
      }
    },
    onRemoveRow: (section, rowType, id) => {
      if (section === 'trips') {
        if (rowType === 'deduction') removeDeduction(id);
        else removeTrip(id);
      } else if (section === 'helpers') {
        if (rowType === 'deduction') removeHelperDeduction(id);
        else removeHelper(id);
      }
    },
  });

  const [status, setStatus] = useState(null);
  const [savingPdf, setSavingPdf] = useState(false);

  useEffect(() => {
    if (!status) return undefined;

    const timer = setTimeout(() => setStatus(null), 6000);
    return () => clearTimeout(timer);
  }, [status]);

  const handleNewPayslip = () => {
    const shouldReset = window.confirm(
      'Start a new payslip? The current draft will be cleared.',
    );

    if (!shouldReset) return;

    reset();
    setStatus({ variant: 'primary', message: 'New payslip started.' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = async () => {
    if (!window.payslipApi?.print) {
      setStatus({
        variant: 'danger',
        message: 'Printing is only available in the desktop app.',
      });
      return;
    }

    try {
      const result = await window.payslipApi.print();
      const failureReason = String(result?.failureReason || '');

      if (result?.success) {
        setStatus({
          variant: 'success',
          message: 'Payslip sent to the printer.',
        });
      } else if (failureReason.toLowerCase().includes('cancel')) {
        setStatus({ variant: 'secondary', message: 'Printing canceled.' });
      } else {
        setStatus({
          variant: 'danger',
          message: failureReason || 'Unable to print the payslip.',
        });
      }
    } catch (error) {
      setStatus({
        variant: 'danger',
        message: error?.message || 'Unable to print the payslip.',
      });
    }
  };

  const handleSavePdf = async () => {
    if (savingPdf) return;

    if (!window.payslipApi?.savePdf) {
      setStatus({
        variant: 'danger',
        message: 'PDF saving is only available in the desktop app.',
      });
      return;
    }

    setSavingPdf(true);

    try {
      const result = await window.payslipApi.savePdf(
        buildPdfFileName(state.meta.name, state.meta.date),
      );

      if (result?.canceled) {
        setStatus({ variant: 'secondary', message: 'PDF save canceled.' });
      } else if (result?.success) {
        setStatus({ variant: 'success', message: 'Payslip saved as a PDF.' });
      } else {
        setStatus({
          variant: 'danger',
          message: result?.error || 'Unable to save the PDF.',
        });
      }
    } catch (error) {
      setStatus({
        variant: 'danger',
        message: error?.message || 'Unable to save the PDF.',
      });
    } finally {
      setSavingPdf(false);
    }
  };

  return (
    <>
      <div className="app-shell">
        <AppBar
          onNew={handleNewPayslip}
          onPrint={handlePrint}
          onSavePdf={handleSavePdf}
          savingPdf={savingPdf}
        />

        <main className="payslip-wrap">
          <article className="payslip-sheet">
            <header className="payslip-heading">
              <div>
                <div className="payslip-kicker">SPD Logistics</div>
                <h1 className="payslip-title">Payslip Generator</h1>
              </div>
              <div className="payslip-heading-note">Payout</div>
            </header>

            <PayslipHeader meta={state.meta} onChange={updateMeta} />

            <hr className="payslip-divider" />

            <TripsSection
              rows={totals.tripRows}
              total={totals.tripTotal}
              deduction={totals.tripDeduction}
              deductions={state.deductions}
              net={totals.tripNet}
              onUpdate={updateTrip}
              onAdd={addTrip}
              onRemove={removeTrip}
              onDeductionUpdate={updateDeduction}
              onAddDeduction={addDeduction}
              onRemoveDeduction={removeDeduction}
            />

            <HelpersSection
              rows={totals.helperRows}
              total={totals.helperTotal}
              deduction={totals.helperDeduction}
              deductions={state.helperDeductions}
              net={totals.helperNet}
              onUpdate={updateHelper}
              onAdd={addHelper}
              onRemove={removeHelper}
              onDeductionUpdate={updateHelperDeduction}
              onAddDeduction={addHelperDeduction}
              onRemoveDeduction={removeHelperDeduction}
            />
          </article>
        </main>

        <StatusToast status={status} onClose={() => setStatus(null)} />
      </div>

      <PrintPayslip
        meta={state.meta}
        totals={totals}
        deductions={state.deductions}
        helperDeductions={state.helperDeductions}
      />
    </>
  );
}
