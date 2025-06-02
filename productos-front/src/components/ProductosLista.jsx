// src/components/ProductosLista.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function ProductosLista() {
  const [productos, setProductos] = useState([]);
  const [error, setError]         = useState('');
  const navigate = useNavigate();

  const fetchProductos = async () => {
    setError('');
    try {
      const response = await api.get('/productos');
      setProductos(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/login');
      } else {
        setError('No se pudo cargar la lista de productos');
      }
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleEditar = (id) => {
    navigate(`/productos/editar/${id}`);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) {
      return;
    }
    try {
      await api.delete(`/productos/${id}`);
      fetchProductos();
    } catch (err) {
      setError('Error al eliminar el producto');
    }
  };

  return (
    <div className="container">
      <h2>Lista de Productos</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={() => navigate('/productos/nuevo')}>Crear Producto</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(prod => (
            <tr key={prod.id}>
              <td>{prod.id}</td>
              <td>{prod.nombre}</td>
              <td>{prod.precio}</td>
              <td>{prod.stock}</td>
              <td>
                <button onClick={() => handleEditar(prod.id)}>Editar</button>
                <button onClick={() => handleEliminar(prod.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}