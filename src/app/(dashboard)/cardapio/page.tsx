'use client';

import { useState } from 'react';
import { useMenuItems, useDeleteMenuItem } from '@/hooks/useApi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MenuItemCard from '@/components/menu/MenuItemCard';
import MenuItemModal from '@/components/menu/MenuItemModal';
import { Plus, Search, AlertCircle } from 'lucide-react';
import { MENU_CATEGORIES, MENU_CATEGORY_LABELS } from '@/constants';

type MenuCategory = typeof MENU_CATEGORIES[keyof typeof MENU_CATEGORIES];

export default function CardapioPage() {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'todos'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const { data: allMenuItems, isLoading, error } = useMenuItems();
  const deleteMenuItem = useDeleteMenuItem();

  const filteredItems = (allMenuItems || []).filter(item => {
    const matchesCategory = selectedCategory === 'todos' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este item?')) {
      await deleteMenuItem.mutateAsync(id);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 border-red-500/50 bg-red-500/10">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-red-400">Erro ao carregar cardápio</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Cardápio</h1>
          <p className="text-[#a0a0a0] mt-2">Gerencie itens do menu</p>
        </div>
        <Button
          onClick={() => {
            setEditingItem(null);
            setShowModal(true);
          }}
          className="bg-[#ffd700] hover:bg-[#ffd700]/80 text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Item
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#a0a0a0]" />
          <Input
            placeholder="Buscar itens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#151515] border-[#2a2a2a] text-white placeholder:text-[#a0a0a0]"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('todos')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === 'todos'
                ? 'bg-[#ffd700] text-black'
                : 'bg-[#151515] border border-[#2a2a2a] text-white hover:border-[#ffd700]/50'
            }`}
          >
            Todos
          </button>
          {Object.entries(MENU_CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as MenuCategory)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === key
                  ? 'bg-[#ffd700] text-black'
                  : 'bg-[#151515] border border-[#2a2a2a] text-white hover:border-[#ffd700]/50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 bg-[#2a2a2a] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
                <MenuItemCard
                key={item.id}
                item={item}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>
        ) : (
          <Card className="p-6 border-[#2a2a2a] bg-[#151515]">
            <p className="text-[#a0a0a0] text-center">Nenhum item encontrado</p>
          </Card>
        )}
      </div>

      {/* Modal */}
      <MenuItemModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingItem(null);
        }}
        editingItem={editingItem}
      />
    </div>
  );
}
