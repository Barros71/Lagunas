'use client';

import { MenuItem, MenuCategory } from '@/types/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2 } from 'lucide-react';
import { formatCurrency } from '@/lib/helpers';
import { MENU_CATEGORY_LABELS, MENU_CATEGORY_COLORS } from '@/constants';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MenuItemCard({
  item,
  onEdit,
  onDelete,
}: MenuItemCardProps) {
  const categoryColor = MENU_CATEGORY_COLORS[item.category as MenuCategory];
  

  return (
    <>
    <Card className="p-4 border-[#2a2a2a] bg-[#151515] hover:border-[#ffd700]/50 transition-colors">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="font-semibold text-white text-lg">{item.name}</p>
            <Badge className={`${categoryColor} border text-xs mt-1`}>
              {MENU_CATEGORY_LABELS[item.category]}
            </Badge>
          </div>
          {item.is_promo && (
            <Badge className="bg-red-500/20 text-red-400 border-red-500">PROMO</Badge>
          )}
        </div>

        {/* Pricing */}
        <div className="space-y-1">
          {item.promo_price && item.is_promo ? (
            <div className="flex items-center gap-2">
              <span className="text-[#a0a0a0] line-through text-sm">
                {formatCurrency(item.price)}
              </span>
              <span className="text-green-400 font-bold">
                {formatCurrency(item.promo_price)}
              </span>
            </div>
          ) : (
            <p className="text-white font-bold text-lg">{formatCurrency(item.price)}</p>
          )}
        </div>

        {/* Availability removed from card to simplify UI */}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={onEdit}
            variant="outline"
            size="sm"
            className="flex-1 border-[#2a2a2a] hover:bg-[#2a2a2a]"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            onClick={onDelete}
            variant="outline"
            size="sm"
            className="flex-1 border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Deletar
          </Button>
        </div>
      </div>
    </Card>
    
    </>
  );
}
