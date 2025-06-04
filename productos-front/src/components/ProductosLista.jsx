// src/components/ProductosLista.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Button, Alert, Spinner } from 'react-bootstrap';

export default function ProductosLista() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProductos = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await api.get('/productos');
      setProductos(response.data.data || response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/login');
      } else {
        setError('No se pudo cargar la lista de productos');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleEditar = (id) => {
    navigate(`/productos/editar/${id}`);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    try {
      await api.delete(`/productos/${id}`);
      fetchProductos();
    } catch (err) {
      setError('Error al eliminar el producto');
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Lista de productos</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button variant="success" className="mb-3" onClick={() => navigate('/productos/nuevo')}>
        Nuevo producto
      </Button>
      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
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
                <td>{prod.categoria ? prod.categoria.nombre : ''}</td>
                <td>{prod.precio}</td>
                <td>{prod.stock}</td>
                <td>
                  <Button variant="primary" size="sm" className="me-2" onClick={() => handleEditar(prod.id)}>
                    Editar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleEliminar(prod.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
