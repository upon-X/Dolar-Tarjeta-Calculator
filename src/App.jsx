import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

export default function App() {
  const [precioDolares, setPrecioDolares] = useState(1);
  const [dolarOficial, setDolarOficial] = useState(null);
  const [fechaAct, setFechaAct] = useState('')
  const [precioPesos, setPrecioPesos] = useState(null);
  const [impuestoPais, setImpuestoPais] = useState(null);
  const [retencion, setRetencion] = useState(null);
  const [bienesPersonales, setBienesPersonales] = useState(null);
  const [precioCalculado, setPrecioCalculado] = useState(null);
  const [widthPage, setWidthPage] = useState(true);

  const mailcel = 'mailto:valemiche003e@gmail.com.ar?subject=CalculadoraDolarTarjeta'
  const mailpc = 'https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=valemiche003@gmail.com&su=CalculadoraDolarTarjeta'

  const formatDate = (dateString) => {
    const options = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    };

    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', options).format(date);
  };
  const fetchData = () => {
    axios.get('https://dolarapi.com/v1/dolares/oficial')
      .then(response => {
        setDolarOficial(response.data.venta);
        setFechaAct(formatDate(response.data.fechaActualizacion));
      })
      .catch(error => {
        // Manejo de errores
        console.error('Error al obtener datos:', error);
      });
  };

  // Efecto para cargar datos al montar el componente y establecer el valor inicial de precioDolares
  useEffect(() => {
    fetchData();
    if (window.innerWidth > 700) {
      setWidthPage(true)
    } else {
      setWidthPage(false)
    }
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Cálculos basados en el valor del input y el valor del dólar oficial
    const precioPesosValue = precioDolares * dolarOficial;
    const impuestoPaisValue = precioPesosValue * 0.3;
    const retencionValue = precioPesosValue;
    const bienesPersonalesValue = precioPesosValue * 0.25;
    const precioCalculadoValue = precioPesosValue + impuestoPaisValue + retencionValue + bienesPersonalesValue;

    // Actualizar los estados
    setPrecioPesos(precioPesosValue.toFixed(2));
    setImpuestoPais(impuestoPaisValue.toFixed(2));
    setRetencion(retencionValue.toFixed(2));
    setBienesPersonales(bienesPersonalesValue.toFixed(2));
    setPrecioCalculado(precioCalculadoValue.toFixed(2));
  };

  return (
    <div className='contenedor'>
      <h1>Dolar Tarjeta | Impuesto País 30% + Retención 100% + Bienes Personales 25%</h1>
      <form onSubmit={handleFormSubmit}>
        <label>Precio en Dolares: </label>
        <input
          className='input_dolares'
          type="number"
          value={precioDolares}
          onChange={(e) => setPrecioDolares(parseFloat(e.target.value))}
          max={999999999999.9}
        />
        <button className='btn_calculate' type="submit" disabled={precioDolares === 0 || !precioDolares ? true : false}>Calcular</button>
      </form>
      <div className='info_precio'>
        <span>Precio Dolar Oficial (Venta): <span className='resultados'>${dolarOficial || '0'}</span></span>
        <span className='fecha_actualizacion'>Ultima actualización: <span className='resultados'>{fechaAct || '0'}</span></span>
        <span>Precio en pesos (Dolar Oficial): <span className='resultados'>${precioPesos || '0'}</span></span>
        <span>Impuesto País 30%: <span className='resultados'>${impuestoPais || '0'}</span></span>
        <span>Retención del 100%: <span className='resultados'>${retencion || '0'}</span></span>
        <span>Bienes Personales 25%: <span className='resultados'>${bienesPersonales || '0'}</span></span>
        <span>Precio Total en pesos: <span className='resultados resultado_final'>${precioCalculado || '0'}</span></span>
      </div>
      <p>Esto nos sirve para saber cuanto nos costara alguna compra en dolares, como en Steam, en Amazon, etc.
        <br />
        Cualquier duda o problema, contactar a este <a target='_blank' href={widthPage === true ? mailpc : mailcel}>Mail</a>
      </p>
      <p className='link_portfolio'>Coded by <a href='https://valemiche.com.ar'>Valentino Micheloni</a></p>
    </div >
  );
}
