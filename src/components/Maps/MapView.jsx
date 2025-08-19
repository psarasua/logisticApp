import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix para los iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const MapView = ({
  clientes = [],
  rutas = [],
  repartos = [],
  center = [-34.6037, -58.3816], // Buenos Aires por defecto
  zoom = 10,
  height = '400px',
  showClientes = true,
  showRutas = true,
  showRepartos = false,
  selectedCliente = null,
  onClienteClick = null,
  className = ''
}) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const layerGroupRef = useRef(null)

  useEffect(() => {
    // Inicializar mapa
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom)

      // Agregar capa de mapa
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current)

      // Crear grupo de capas
      layerGroupRef.current = L.layerGroup().addTo(mapInstanceRef.current)
    }

    return () => {
      // Limpiar al desmontar
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return

    // Limpiar capas existentes
    layerGroupRef.current.clearLayers()

    // Iconos personalizados
    const clienteIcon = L.divIcon({
      html: '<div style="background-color: #3B82F6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>',
      className: 'custom-marker',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    })

    const repartoIcon = L.divIcon({
      html: '<div style="background-color: #EF4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>',
      className: 'custom-marker',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    })

    const selectedIcon = L.divIcon({
      html: '<div style="background-color: #F59E0B; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4); animation: pulse 2s infinite;"></div>',
      className: 'custom-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    })

    // Añadir marcadores de clientes
    if (showClientes && clientes.length > 0) {
      clientes.forEach(cliente => {
        if (cliente.latitud && cliente.longitud) {
          const isSelected = selectedCliente && selectedCliente.id === cliente.id
          const marker = L.marker(
            [parseFloat(cliente.latitud), parseFloat(cliente.longitud)],
            { icon: isSelected ? selectedIcon : clienteIcon }
          )

          marker.bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold text-gray-900">${cliente.nombre}</h3>
              <p class="text-sm text-gray-600">${cliente.direccion}</p>
              <p class="text-xs text-gray-500">Tel: ${cliente.telefono}</p>
              <p class="text-xs text-gray-500">Email: ${cliente.email}</p>
            </div>
          `)

          if (onClienteClick) {
            marker.on('click', () => onClienteClick(cliente))
          }

          layerGroupRef.current.addLayer(marker)
        }
      })
    }

    // Añadir rutas (líneas entre puntos)
    if (showRutas && rutas.length > 0) {
      rutas.forEach(ruta => {
        if (ruta.puntos && ruta.puntos.length >= 2) {
          const latlngs = ruta.puntos.map(punto => [punto.lat, punto.lng])

          const polyline = L.polyline(latlngs, {
            color: ruta.estado === 'activa' ? '#10B981' : '#6B7280',
            weight: 3,
            opacity: 0.8
          })

          polyline.bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold text-gray-900">${ruta.nombre}</h3>
              <p class="text-sm text-gray-600">${ruta.ciudad_origen} → ${ruta.ciudad_destino}</p>
              <p class="text-xs text-gray-500">Distancia: ${ruta.distancia_km}km</p>
              <p class="text-xs text-gray-500">Estado: ${ruta.estado}</p>
            </div>
          `)

          layerGroupRef.current.addLayer(polyline)
        }
      })
    }

    // Añadir marcadores de repartos
    if (showRepartos && repartos.length > 0) {
      repartos.forEach(reparto => {
        const cliente = clientes.find(c => c.id === reparto.cliente_id)
        if (cliente && cliente.latitud && cliente.longitud) {
          const marker = L.marker(
            [parseFloat(cliente.latitud), parseFloat(cliente.longitud)],
            { icon: repartoIcon }
          )

          const estadoColors = {
            pendiente: 'text-yellow-600',
            en_transito: 'text-blue-600',
            entregado: 'text-green-600',
            cancelado: 'text-red-600'
          }

          marker.bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold text-gray-900">Reparto #${reparto.id}</h3>
              <p class="text-sm text-gray-600">${cliente.nombre}</p>
              <p class="text-xs text-gray-500">${cliente.direccion}</p>
              <p class="text-xs ${estadoColors[reparto.estado] || 'text-gray-500'}">
                Estado: ${reparto.estado?.replace('_', ' ')}
              </p>
              <p class="text-xs text-gray-500">Peso: ${reparto.peso_total}kg</p>
            </div>
          `)

          layerGroupRef.current.addLayer(marker)
        }
      })
    }

    // Ajustar vista si hay marcadores
    if (layerGroupRef.current.getLayers().length > 0) {
      mapInstanceRef.current.fitBounds(layerGroupRef.current.getBounds(), { padding: [10, 10] })
    }

  }, [clientes, rutas, repartos, showClientes, showRutas, showRepartos, selectedCliente, onClienteClick])

  return (
    <>
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        .custom-marker div {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
      <div 
        ref={mapRef} 
        style={{ height }} 
        className={`w-full rounded-lg border ${className}`}
      />
    </>
  )
}

export default MapView