import { useState } from 'react';
import useFetch from '../../hooks/useFetch';

export default function RequestManagement() {
  // Hook para obtener solicitudes
  const { data: requests, loading, error, refetch } = useFetch('http://127.0.0.1:3000/api/requests');
  const pendingRequests = (requests || []).filter(request => request.estado === 'pendiente');
  const processedRequests = (requests || []).filter(request => request.estado !== 'pendiente');

  const handleUpdateRequest = (requestId, newStatus) => {
    // Lógica para actualizar solicitud (aprobar/rechazar)
    // ...
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'aprobada':
        return 'bg-green-100 text-green-800';
      case 'rechazada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {loading && <div>Cargando solicitudes...</div>}
      {error && <div className="text-red-500">Error al cargar solicitudes</div>}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Gestión de Solicitudes</h1>
        <p className="text-slate-600">Administra las solicitudes de préstamos de libros</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Solicitudes Pendientes</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {pendingRequests.length}
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Solicitudes Aprobadas</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {processedRequests.filter(request => request.estado === 'aprobada').length}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Solicitudes Rechazadas</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {processedRequests.filter(request => request.estado === 'rechazada').length}
              </p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="card">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Solicitudes Pendientes</h2>
          <p className="text-sm text-slate-600">Requieren tu atención</p>
        </div>
        
        {pendingRequests.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-slate-900">No hay solicitudes pendientes</h3>
            <p className="mt-1 text-sm text-slate-500">Todas las solicitudes han sido procesadas.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900">{request.id_libro}</h3>
                    <p className="text-sm text-slate-600">Solicitado por: {request.id_usuario}</p>
                    <p className="text-sm text-slate-500">Fecha: {request.fSolicitud}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateRequest(request.id, 'aprobada')}
                      className="btn-primary text-sm"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleUpdateRequest(request.id, 'rechazada')}
                      className="btn-danger text-sm"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Requests Table */}
      <div className="card">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Historial de Solicitudes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-700">Libro</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Usuario</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Fecha Solicitud</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(requests || []).map((request) => (
                <tr key={request.id} className="table-row">
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">{request.id_libro}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{request.id_usuario}</td>
                  <td className="py-3 px-4 text-slate-600">{request.fSolicitud}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.estado)}`}>
                      {request.estado}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {request.estado === 'pendiente' ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateRequest(request.id, 'aprobada')}
                          className="text-green-600 hover:text-green-700 text-sm"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleUpdateRequest(request.id, 'rechazada')}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Rechazar
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-sm">Procesada</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}