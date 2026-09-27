import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterSidebar } from './components/FilterSidebar';
import { MapView } from './components/MapView';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { BookModal } from './components/BookModal';
import { SalesMirrorModal } from './components/SalesMirrorModal';
import { Empreendimento, FiltrosState, FaixaPreco } from './types/empreendimento';
import { checkPrecoMatch } from './utils/formatters';
import { generateSingleFileHtml } from './utils/exportSingleFile';
import empreendimentosData from './data/empreendimentos.json';

const INITIAL_FILTROS: FiltrosState = {
  busca: '',
  cidade: '',
  bairro: '',
  zona: '',
  status: '',
  faixaPreco: 'todos',
};

export default function App() {
  const allItems: Empreendimento[] = empreendimentosData as Empreendimento[];

  // State
  const [filtros, setFiltros] = useState<FiltrosState>(INITIAL_FILTROS);
  const [selectedItem, setSelectedItem] = useState<Empreendimento | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState<boolean>(false);
  const [isEspelhoModalOpen, setIsEspelhoModalOpen] = useState<boolean>(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  // Available Filter Options (derived from data)
  const availableCities = useMemo(() => {
    return Array.from(new Set(allItems.map((item) => item.cidade))).sort();
  }, [allItems]);

  const availableZonas = useMemo(() => {
    return Array.from(new Set(allItems.map((item) => item.zona))).sort();
  }, [allItems]);

  const availableBairros = useMemo(() => {
    // If a city is selected, show only neighborhoods of that city
    const items = filtros.cidade
      ? allItems.filter((item) => item.cidade === filtros.cidade)
      : allItems;
    return Array.from(new Set(items.map((item) => item.bairro))).sort();
  }, [allItems, filtros.cidade]);

  const availableStatuses = useMemo(() => {
    return Array.from(new Set(allItems.map((item) => item.status))).sort();
  }, [allItems]);

  // Filter Logic (simultaneous active filters)
  const filteredItems = useMemo(() => {
    const q = filtros.busca.trim().toLowerCase();

    return allItems.filter((item) => {
      // 1. Search Query (Name, Bairro, Cidade, Endereço)
      if (q) {
        const matchName = item.nome.toLowerCase().includes(q);
        const matchBairro = item.bairro.toLowerCase().includes(q);
        const matchCidade = item.cidade.toLowerCase().includes(q);
        const matchEndereco = item.endereco.toLowerCase().includes(q);
        if (!matchName && !matchBairro && !matchCidade && !matchEndereco) {
          return false;
        }
      }

      // 2. City
      if (filtros.cidade && item.cidade !== filtros.cidade) {
        return false;
      }

      // 3. Neighborhood
      if (filtros.bairro && item.bairro !== filtros.bairro) {
        return false;
      }

      // 4. Zone
      if (filtros.zona && item.zona !== filtros.zona) {
        return false;
      }

      // 5. Status
      if (filtros.status && item.status !== filtros.status) {
        return false;
      }

      // 6. Price Range
      if (!checkPrecoMatch(item.precoInicial, filtros.faixaPreco)) {
        return false;
      }

      return true;
    });
  }, [allItems, filtros]);

  // Handlers
  const handleFiltroChange = <K extends keyof FiltrosState>(key: K, value: FiltrosState[K]) => {
    setFiltros((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setFiltros(INITIAL_FILTROS);
    setSelectedItem(null);
  };

  const handleSelectItem = (item: Empreendimento) => {
    setSelectedItem(item);
  };

  const handleOpenDetails = (item: Empreendimento) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleCenterOnMap = (item: Empreendimento) => {
    setSelectedItem(item);
  };

  const handleOpenBook = (item: Empreendimento) => {
    setSelectedItem(item);
    setIsBookModalOpen(true);
  };

  const handleOpenEspelho = (item: Empreendimento) => {
    setSelectedItem(item);
    setIsEspelhoModalOpen(true);
  };

  // Export Single-File HTML Trigger
  const handleExportSingleFile = () => {
    const htmlContent = generateSingleFileHtml(allItems);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mapa-imobiliario.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const hasActiveFilters = Boolean(
    filtros.busca.trim() !== '' ||
    filtros.cidade !== '' ||
    filtros.bairro !== '' ||
    filtros.zona !== '' ||
    filtros.status !== '' ||
    filtros.faixaPreco !== 'todos'
  );

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-900 font-sans">
      {/* Top Header */}
      <Header
        filteredItems={filteredItems}
        totalOriginalCount={allItems.length}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
        onExportSingleFile={handleExportSingleFile}
      />

      {/* Main Workspace: Sidebar + Map */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar */}
        <FilterSidebar
          filtros={filtros}
          onFiltroChange={handleFiltroChange}
          onResetFilters={handleResetFilters}
          filteredItems={filteredItems}
          selectedItem={selectedItem}
          onSelectItem={handleSelectItem}
          onOpenDetails={handleOpenDetails}
          availableCities={availableCities}
          availableBairros={availableBairros}
          availableZonas={availableZonas}
          availableStatuses={availableStatuses}
          isMobileOpen={isMobileFiltersOpen}
          onCloseMobile={() => setIsMobileFiltersOpen(false)}
        />

        {/* Map View */}
        <main className="flex-1 h-full relative">
          <MapView
            items={filteredItems}
            selectedItem={selectedItem}
            onSelectItem={handleSelectItem}
            onOpenDetails={handleOpenDetails}
          />
        </main>
      </div>

      {/* Property Details Modal */}
      <PropertyDetailModal
        item={selectedItem}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onCenterOnMap={handleCenterOnMap}
        onOpenBook={handleOpenBook}
        onOpenEspelho={handleOpenEspelho}
      />

      {/* Book Modal */}
      <BookModal
        item={selectedItem}
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
      />

      {/* Sales Mirror (Espelho de Vendas) Modal */}
      <SalesMirrorModal
        item={selectedItem}
        isOpen={isEspelhoModalOpen}
        onClose={() => setIsEspelhoModalOpen(false)}
      />
    </div>
  );
}
