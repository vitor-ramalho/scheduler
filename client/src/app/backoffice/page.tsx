'use client';

import { useEffect, useState } from 'react';
import { backofficeService, OrganizationStats, BackofficeStats } from '@/services/backofficeService';
import { Loader2, Users, Building, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';

export default function BackofficePage() {
  const [stats, setStats] = useState<BackofficeStats | null>(null);
  const [organizations, setOrganizations] = useState<OrganizationStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching backoffice data...');
      const [statsData, orgsData] = await Promise.all([
        backofficeService.getStats(),
        backofficeService.getOrganizations(),
      ]);
      console.log('Backoffice data loaded:', { statsData, orgsData });

      setStats(statsData);
      setOrganizations(orgsData);
    } catch (err) {
      console.error('Erro ao carregar dados do backoffice:', err);
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      console.error('Erro response:', error.response);
      console.error('Erro message:', error.message);
      setError(`Erro ao carregar dados: ${error.response?.data?.message || error.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrganization = async (id: string, currentStatus: boolean) => {
    try {
      setToggling(id);
      
      if (currentStatus) {
        await backofficeService.disableOrganization(id);
      } else {
        await backofficeService.enableOrganization(id);
      }
      
      await fetchData(); // Recarregar dados
    } catch (err) {
      console.error('Erro ao alterar status:', err);
      setError('Erro ao alterar status da organização');
    } finally {
      setToggling(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Building className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{stats.totalOrganizations}</div>
            <div className="text-sm text-gray-600">Total de Organizações</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.enabledOrganizations}</div>
            <div className="text-sm text-gray-600">Habilitadas</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.disabledOrganizations}</div>
            <div className="text-sm text-gray-600">Desabilitadas</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{stats.totalUsers}</div>
            <div className="text-sm text-gray-600">Total de Usuários</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Calendar className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{stats.totalAppointments}</div>
            <div className="text-sm text-gray-600">Total de Agendamentos</div>
          </div>
        </div>
      )}

      {/* Lista de Organizações */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Organizações</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {organizations.map((org) => (
            <div key={org.id} className="p-6 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">{org.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    org.enabled 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {org.enabled ? 'Habilitada' : 'Desabilitada'}
                  </span>
                </div>
                
                <div className="mt-1 text-sm text-gray-600">
                  <p><span className="font-medium">Slug:</span> {org.slug}</p>
                  <p><span className="font-medium">Email:</span> {org.email || 'N/A'}</p>
                  <p><span className="font-medium">Telefone:</span> {org.phone || 'N/A'}</p>
                </div>
                
                <div className="mt-3 flex space-x-6 text-sm text-gray-500">
                  <span>{org.usersCount || 0} usuários</span>
                  <span>{org.clientsCount || 0} clientes</span>
                  <span>{org.appointmentsCount || 0} agendamentos</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleOrganization(org.id, org.enabled)}
                  disabled={toggling === org.id}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    org.enabled
                      ? 'bg-red-50 text-red-700 hover:bg-red-100'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  } ${toggling === org.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {toggling === org.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : org.enabled ? (
                    <ToggleRight className="h-4 w-4" />
                  ) : (
                    <ToggleLeft className="h-4 w-4" />
                  )}
                  <span>{org.enabled ? 'Desabilitar' : 'Habilitar'}</span>
                </button>
              </div>
            </div>
          ))}
          
          {organizations.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Nenhuma organização encontrada
            </div>
          )}
        </div>
      </div>
    </div>
  );
}