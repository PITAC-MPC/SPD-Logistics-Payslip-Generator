const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('payslipApi', {
  savePdf: (suggestedName) =>
    ipcRenderer.invoke('payslip:save-pdf', suggestedName),
  print: () => ipcRenderer.invoke('payslip:print'),
});
