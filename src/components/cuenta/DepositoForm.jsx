import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useCuenta } from '../../shared/hooks';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';

const DepositoForm = ({ cuentaId, onSuccess, onCancel }) => {
  const { loading, error } = useCuenta();
  const [form, setForm] = useState({
    monto: '',
    descripcion: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Depósito para cuenta:', cuentaId);
    if (onSuccess) {
      onSuccess({
        success: true,
        monto: parseFloat(form.monto),
        descripcion: form.descripcion
      });
    }
  };

  return (
    <Card>
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Realizar Depósito</h2>
          <p className="text-gray-600">Ingresa el monto a depositar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Monto del Depósito"
            name="monto"
            type="number"
            value={form.monto}
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
            placeholder="0.00"
            className="text-lg"
          />

          <Input
            label="Descripción (opcional)"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción del depósito"
            maxLength={100}
          />

          <div className="flex space-x-2">
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !form.monto}
              className="flex-1"
            >
              {loading ? 'Procesando...' : 'Depositar'}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                className="flex-1"
              >
                Cancelar
              </Button>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              Error: {error.message || 'Ocurrió un error al procesar el depósito'}
            </div>
          )}
        </form>
      </div>
    </Card>
  );
};

DepositoForm.propTypes = {
  cuentaId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func
};

export default DepositoForm;