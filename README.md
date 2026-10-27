# SPD Logistics Payslip Generator

A desktop payslip generator for SPD Logistics. It is built with React, Vite, and Electron, and can save an A4 payslip as a PDF or send it to a printer.

## Requirements

- Node.js 22.12 or newer
- npm
- Windows for the configured Electron Builder targets

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Run Vite and Electron in development
npm run build     # Build the React renderer into dist/
npm start         # Build and launch Electron
npm test          # Run the Vitest test suite
npm run dist      # Build the Windows NSIS and portable releases
```

## Project Structure

### Root Files

| File                                        | Purpose                                                                                                                                                           |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `README.md`                                 | Project documentation, setup instructions, and file guide.                                                                                                        |
| `index.html`                                | Vite HTML entry point. Defines the root element, page title, and Content Security Policy.                                                                         |
| `package.json`                              | Project metadata, npm scripts, dependencies, and Electron Builder configuration for Windows NSIS and portable x64 builds.                                         |
| `package-lock.json`                         | npm dependency lockfile for reproducible installs. Generated and maintained by npm.                                                                               |
| `vite.config.js`                            | Vite and Vitest configuration. Enables React, uses relative asset paths for Electron, sets the development port to 5173, and writes production assets to `dist/`. |
| `.gitignore`                                | Excludes dependencies, build output, releases, and log files from version control.                                                                                |
| `.prettierignore`                           | Prevents Prettier from formatting dependencies, generated output, the lockfile, and PDF samples.                                                                  |
| `.prettierrc.json`                          | Shared Prettier formatting rules: semicolons, single quotes, trailing commas, and automatic line endings.                                                         |
| `build/icon.ico`                            | Multi-size Windows application and installer icon used by Electron Builder.                                                                                       |
| `sample/Payslip - ERICSON - 2026-10-21.pdf` | Reference PDF used to check the printed payslip layout and output.                                                                                                |

### Electron Files

| File                   | Purpose                                                                                                                                                                                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `electron/main.cjs`    | Electron main process. Creates the application window, enforces a single running instance, removes the application menu, restricts navigation, loads either the Vite development server or the built `dist/index.html`, and registers the PDF-save and print IPC handlers. |
| `electron/preload.cjs` | Secure context bridge. Exposes `window.payslipApi.savePdf()` and `window.payslipApi.print()` to the renderer without enabling Node.js access in the page.                                                                                                                  |

### Application Entry Files

| File           | Purpose                                                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/main.jsx` | Browser entry point. Imports Bootstrap, Bootstrap Icons, application styles, and print styles, then mounts `App` into `#root`.                                                                         |
| `src/App.jsx`  | Main application component. Connects the payslip state hook, calculates totals, handles new/reset, print, and save-PDF actions, and renders both the editable screen UI and the hidden print document. |

### App Components

| File                                 | Purpose                                                                                                             |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `src/components/app/AppBar.jsx`      | Top application toolbar. Contains New Payslip, Print, and Save as PDF actions.                                      |
| `src/components/app/StatusToast.jsx` | Floating toast notification used for success, cancellation, and error feedback. It is excluded from printed output. |

### Payslip Components

| File                                             | Purpose                                                                                                                           |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/payslip/PayslipHeader.jsx`       | Driver metadata form for name, vehicle type, plate number, and date.                                                              |
| `src/components/payslip/DescriptionsSection.jsx` | Payout descriptions section. Renders the description table, Add Description action, empty state, deduction sub-table, and totals. |
| `src/components/payslip/DescriptionRow.jsx`      | Editable row for one payout description. Handles description, trips, rate, computed amount, and row removal.                      |
| `src/components/payslip/HelpersSection.jsx`      | Helper payout section. Renders the helper table, Add Helper action, empty state, deduction sub-table, and totals.                 |
| `src/components/payslip/HelperRow.jsx`           | Editable row for one helper. Handles helper name, headcount, rate, computed amount, and row removal.                              |
| `src/components/payslip/DeductionsTable.jsx`     | Deduction sub-table for a section. Renders the deductions heading, rows, remove actions, and empty state.                         |
| `src/components/payslip/DeductionRow.jsx`        | Editable deduction row with reason, amount, and row removal.                                                                      |
| `src/components/payslip/SectionTotalRow.jsx`     | Labeled total row used for total amount, total deductions, and net total.                                                         |
| `src/components/payslip/PrintFooter.jsx`         | Print-only signature area with side-by-side "Prepared By" and "Received by" lines.                                                |

### Shared UI Components

| File                                   | Purpose                                                                                                                                            |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/ui/NumericInput.jsx`   | Reusable text input for numeric entry. Sanitizes whole numbers or two-decimal currency values and uses numeric/decimal mobile keyboards.           |
| `src/components/ui/SectionHeading.jsx` | Reusable section heading with an optional eyebrow, description, and action button. Screen-only elements are marked so they do not appear in print. |

### State, Calculations, and Formatting

| File                      | Purpose                                                                                                                                                                                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/hooks/usePayslip.js` | Central payslip state hook. Creates default rows, loads and saves drafts in `localStorage`, migrates older draft shapes, normalizes stored values, and provides update/add/remove/reset actions for metadata, descriptions, helpers, and deductions. |
| `src/lib/calculations.js` | Pure calculation helpers. Computes description and helper line amounts, sums rows and deductions, and derives description/helper totals, deductions, and net pay.                                                                                    |
| `src/lib/format.js`       | Shared formatting and validation helpers. Formats Philippine pesos and long dates, converts and rounds numbers, sanitizes integer/decimal input, produces today's ISO date, and builds safe PDF filenames.                                           |

### Print Files

| File                         | Purpose                                                                                                                                                                                                    |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/print/PrintPayslip.jsx` | Hidden A4 print document. Filters blank rows, renders the company header, driver metadata, description and helper tables, totals and deduction summaries, Net highlighting, and the signature footer.      |
| `src/print/print.css`        | Print-only styling. Hides the screen UI, defines A4 page margins and typography, formats tables and summaries, applies the Net highlight, prevents page breaks inside key blocks, and lays out the footer. |

### Styling

| File                 | Purpose                                                                                                                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/styles/app.css` | Screen application styling. Defines the color system, page background, toolbar, editable payslip sheet, tables, inputs, summary panels, toast, empty states, and responsive layout. |

### Tests

| File                               | Purpose                                                                                                                                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/calculations.test.js`       | Vitest coverage for description/helper calculations, multiple and negative deductions, blank input handling, rounding, input sanitizers, date/peso formatting, and PDF filename generation. |
| `tests/gridNavigation.test.js`     | Unit coverage for row/column keyboard navigation bounds, clamping, empty rows, and cross-section traversal.                                                                                 |
| `tests/gridNavigation.dom.test.js` | jsdom integration coverage for the app bar, header, section actions, and add/remove keyboard flows.                                                                                         |

## Generated Directories

These directories are created by tooling and are not source files:

- `dist/` - Vite production build of the renderer.
- `release/` - Electron Builder installers and portable executables.
- `node_modules/` - Installed npm dependencies.

## Printing

The Print button in `src/components/app/AppBar.jsx` sends the payslip to the system print dialog. The feature uses:

- `src/App.jsx` - `handlePrint` calls the preload API.
- `electron/preload.cjs` - exposes `window.payslipApi.print()`.
- `electron/main.cjs` - handles `payslip:print` and opens the system print dialog.
