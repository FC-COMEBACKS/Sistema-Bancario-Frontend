import React from 'react';

const MovimientosTable = ({ movimientos }) => {
  if (!movimientos || movimientos.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-2">No hay movimientos</h3>
        <p className="text-gray-500">No se encontraron movimientos.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cuenta Origen</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cuenta Destino</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {movimientos.map((mov) => {
            const cuentaOrigen = mov.cuentaOrigenDetalle || mov.cuentaOrigen;
            const cuentaDestino = mov.cuentaDestinoDetalle || mov.cuentaDestino;
            return (
              <tr key={mov._id || mov.mid}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{new Date(mov.fechaHora).toLocaleString()}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{
                  {
                    TRANSFERENCIA: 'Transferencia',
                    DEPOSITO: 'Depósito',
                    COMPRA: 'Compra',
                    CREDITO: 'Crédito',
                    CANCELACION: 'Cancelación'
                  }[mov.tipo] || mov.tipo
                }</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">Q {mov.monto}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{cuentaOrigen?.numeroCuenta || '-'}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{cuentaDestino?.numeroCuenta || '-'}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{mov.descripcion || '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MovimientosTable;
