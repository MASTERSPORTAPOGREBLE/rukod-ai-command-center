import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Province, Unit, Player, Position } from '../../models/game';

interface GameMapProps {
  provinces: Province[];
  players: Player[];
  selectedProvince?: Province;
  onProvinceClick: (province: Province) => void;
  onUnitClick: (unit: Unit) => void;
  selectedUnit?: Unit;
  mapWidth?: number;
  mapHeight?: number;
}

export const GameMap: React.FC<GameMapProps> = ({
  provinces,
  players,
  selectedProvince,
  onProvinceClick,
  onUnitClick,
  selectedUnit,
  mapWidth = 1200,
  mapHeight = 800
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  // Province colors by country
  const getCountryColor = useCallback((countryId: string): string => {
    const player = players.find(p => p.countryId === countryId);
    if (!player) return '#555555';
    
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    
    const index = players.indexOf(player) % colors.length;
    return colors[index];
  }, [players]);

  // Draw the map
  const drawMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context state
    ctx.save();

    // Apply zoom and pan
    ctx.scale(zoom, zoom);
    ctx.translate(offset.x, offset.y);

    // Draw provinces
    provinces.forEach(province => {
      drawProvince(ctx, province);
    });

    // Draw units
    provinces.forEach(province => {
      province.units.forEach(unit => {
        drawUnit(ctx, unit);
      });
    });

    // Draw selection indicators
    if (selectedProvince) {
      drawProvinceSelection(ctx, selectedProvince);
    }

    if (selectedUnit) {
      drawUnitSelection(ctx, selectedUnit);
    }

    // Restore context state
    ctx.restore();
  }, [provinces, selectedProvince, selectedUnit, zoom, offset, getCountryColor]);

  // Draw a single province
  const drawProvince = (ctx: CanvasRenderingContext2D, province: Province) => {
    const color = getCountryColor(province.countryId);
    const radius = Math.sqrt(province.population / 1000) + 20;

    // Province circle
    ctx.beginPath();
    ctx.arc(province.position.x, province.position.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Province name
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(province.name, province.position.x, province.position.y - radius - 5);

    // Population indicator
    ctx.font = '10px Arial';
    ctx.fillText(`${Math.floor(province.population / 1000)}K`, province.position.x, province.position.y + 5);

    // Capital indicator
    if (province.isCapital) {
      ctx.beginPath();
      ctx.arc(province.position.x, province.position.y, radius + 5, 0, 2 * Math.PI);
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Infrastructure level indicator
    const infraBars = Math.min(5, Math.floor(province.infrastructure / 20));
    for (let i = 0; i < infraBars; i++) {
      ctx.fillStyle = '#00FF00';
      ctx.fillRect(
        province.position.x - radius + (i * 6),
        province.position.y + radius + 10,
        4,
        8
      );
    }
  };

  // Draw province selection
  const drawProvinceSelection = (ctx: CanvasRenderingContext2D, province: Province) => {
    const radius = Math.sqrt(province.population / 1000) + 20;
    
    ctx.beginPath();
    ctx.arc(province.position.x, province.position.y, radius + 10, 0, 2 * Math.PI);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  // Draw a unit
  const drawUnit = (ctx: CanvasRenderingContext2D, unit: Unit) => {
    const unitSize = 8;
    const color = getUnitColor(unit.type);

    // Unit background
    ctx.fillStyle = color;
    ctx.fillRect(
      unit.position.x - unitSize / 2,
      unit.position.y - unitSize / 2,
      unitSize,
      unitSize
    );

    // Unit border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(
      unit.position.x - unitSize / 2,
      unit.position.y - unitSize / 2,
      unitSize,
      unitSize
    );

    // Health bar
    const healthPercent = unit.health / unit.maxHealth;
    const barWidth = unitSize;
    const barHeight = 2;
    
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(
      unit.position.x - barWidth / 2,
      unit.position.y - unitSize / 2 - 5,
      barWidth,
      barHeight
    );
    
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(
      unit.position.x - barWidth / 2,
      unit.position.y - unitSize / 2 - 5,
      barWidth * healthPercent,
      barHeight
    );
  };

  // Draw unit selection
  const drawUnitSelection = (ctx: CanvasRenderingContext2D, unit: Unit) => {
    const unitSize = 12;
    
    ctx.strokeStyle = '#FFFF00';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      unit.position.x - unitSize / 2,
      unit.position.y - unitSize / 2,
      unitSize,
      unitSize
    );
  };

  // Get unit color by type
  const getUnitColor = (unitType: string): string => {
    const colors: { [key: string]: string } = {
      infantry: '#8B4513',
      armor: '#A0A0A0',
      artillery: '#FF4500',
      fighter: '#4169E1',
      bomber: '#DC143C',
      naval_ship: '#000080',
      submarine: '#2F4F4F',
      anti_air: '#9932CC'
    };
    return colors[unitType] || '#808080';
  };

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / zoom - offset.x;
    const y = (e.clientY - rect.top) / zoom - offset.y;

    // Check for unit clicks first
    let unitClicked = false;
    for (const province of provinces) {
      for (const unit of province.units) {
        const distance = Math.sqrt(
          Math.pow(x - unit.position.x, 2) + Math.pow(y - unit.position.y, 2)
        );
        if (distance < 10) {
          onUnitClick(unit);
          unitClicked = true;
          break;
        }
      }
      if (unitClicked) break;
    }

    // If no unit was clicked, check for province clicks
    if (!unitClicked) {
      for (const province of provinces) {
        const radius = Math.sqrt(province.population / 1000) + 20;
        const distance = Math.sqrt(
          Math.pow(x - province.position.x, 2) + Math.pow(y - province.position.y, 2)
        );
        if (distance < radius) {
          onProvinceClick(province);
          break;
        }
      }
    }

    // Start dragging
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    setOffset(prev => ({
      x: prev.x + deltaX / zoom,
      y: prev.y + deltaY / zoom
    }));

    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.1, Math.min(3, prev * zoomFactor)));
  };

  // Initialize and redraw
  useEffect(() => {
    drawMap();
  }, [drawMap]);

  return (
    <div className="relative border border-gray-300 bg-gray-900">
      <canvas
        ref={canvasRef}
        width={mapWidth}
        height={mapHeight}
        className="cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
      
      {/* Map controls */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-2 rounded">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setZoom(prev => Math.min(3, prev * 1.2))}
            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            +
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(0.1, prev * 0.8))}
            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            -
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setOffset({ x: 0, y: 0 });
            }}
            className="px-2 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white p-2 rounded text-sm">
        Zoom: {Math.round(zoom * 100)}%
      </div>
    </div>
  );
};