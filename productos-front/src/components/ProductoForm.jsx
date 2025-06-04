// src/components/ProductoForm.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

export default function ProductoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState('');
  const esEdicion = Boolean(id);

  useEffect(() => {
    api.get('/categorias')
      .then(res => setCategorias(res.data))
      .catch(() => setCategorias([]));
  }, []);

  useEffect(() => {
    if (esEdicion) {
      (async () => {
        try {
          const response = await api.get(`/productos/${id}`);
          const prod = response.data.data;
          setNombre(prod.nombre);
          setDescripcion(prod.descripcion || '');
          setPrecio(prod.precio);
          setStock(prod.stock);
          setCategoriaId(prod.categoria_id || (prod.categoria && prod.categoria.id) || '');
        } catch (err) {
          setError('No se pudo cargar el producto');
        }
      })();
    }
  }, [id, esEdicion]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = { nombre, descripcion, precio, stock, categoria_id: categoriaId };
    try {
      if (esEdicion) {
        await api.put(`/productos/${id}`, payload);
      } else {
        await api.post('/productos', payload);
      }
      navigate('/productos');
    } catch (err) {
      if (err.response) {
        if (err.response.status === 422) {
          setError('Datos inválidos. Revisa los campos.');
        } else if (err.response.status === 401) {
          navigate('/login');
        } else {
          setError('Error en la petición al servidor');
        }
      } else {
        setError('Error de red');
      }
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Card style={{ minWidth: '400px' }}>
        <Card.Body>
          <h2 className="mb-4">{esEdicion ? 'Editar producto' : 'Nuevo producto'}</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPrecio">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={precio}
                onChange={e => setPrecio(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formStock">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={stock}
                onChange={e => setStock(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCategoria">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                value={categoriaId}
                onChange={e => setCategoriaId(e.target.value)}
                required
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              {esEdicion ? 'Guardar cambios' : 'Crear producto'}
            </Button>
            <Button variant="secondary" className="w-100 mt-2" onClick={() => navigate('/productos')}>
              Cancelar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
