import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';

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

  // Obtener categorías
  useEffect(() => {
    api.get('/categorias')
      .then(res => setCategorias(res.data))
      .catch(() => setCategorias([]));
  }, []);

  // Cargar producto si es edición
  useEffect(() => {
    if (esEdicion) {
      (async () => {
        try {
          const response = await api.get(`/productos/${id}`);
          const prod = response.data;
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
    <div className="container">
      <h2>{esEdicion ? 'Editar Producto' : 'Crear Producto'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
          />
        </div>
        <div>
          <label>Precio:</label>
          <input
            type="number"
            step="0.01"
            value={precio}
            onChange={e => setPrecio(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Stock:</label>
          <input
            type="number"
            value={stock}
            onChange={e => setStock(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Categoría:</label>
          <select
            value={categoriaId}
            onChange={e => setCategoriaId(e.target.value)}
            required
          >
            <option value="">-- Selecciona categoría --</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>
        <button type="submit">{esEdicion ? 'Actualizar' : 'Crear'}</button>
      </form>
    </div>
  );
}
