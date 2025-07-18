import React, { useState } from 'react';
import { Province, UnitType, BuildingType } from '../../models/game';
import { 
  Home, 
  Factory, 
  Plane, 
  Anchor, 
  Shield, 
  Wrench, 
  FlaskConical, 
  Pickaxe,
  Users,
  Sword,
  Truck,
  Target
} from 'lucide-react';

interface ProvincePanelProps {
  province?: Province;
  onUnitProduction: (provinceId: string, unitType: UnitType) => void;
  onBuildingConstruction: (provinceId: string, buildingType: BuildingType) => void;
  canControl: boolean;
}

export const ProvincePanel: React.FC<ProvincePanelProps> = ({
  province,
  onUnitProduction,
  onBuildingConstruction,
  canControl
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'buildings' | 'units' | 'production'>('info');

  if (!province) {
    return (
      <div className="p-4 text-gray-400 text-center">
        Выберите провинцию на карте
      </div>
    );
  }

  const getBuildingIcon = (type: BuildingType) => {
    const icons = {
      [BuildingType.BARRACKS]: Users,
      [BuildingType.FACTORY]: Factory,
      [BuildingType.AIRFIELD]: Plane,
      [BuildingType.PORT]: Anchor,
      [BuildingType.FORT]: Shield,
      [BuildingType.INFRASTRUCTURE]: Wrench,
      [BuildingType.RESEARCH_LAB]: FlaskConical,
      [BuildingType.RESOURCE_EXTRACTOR]: Pickaxe
    };
    return icons[type] || Home;
  };

  const getUnitIcon = (type: UnitType) => {
    const icons = {
      [UnitType.INFANTRY]: Users,
      [UnitType.ARMOR]: Truck,
      [UnitType.ARTILLERY]: Target,
      [UnitType.FIGHTER]: Plane,
      [UnitType.BOMBER]: Plane,
      [UnitType.NAVAL_SHIP]: Anchor,
      [UnitType.SUBMARINE]: Anchor,
      [UnitType.ANTI_AIR]: Shield
    };
    return icons[type] || Sword;
  };

  const availableBuildings = Object.values(BuildingType);
  const availableUnits = Object.values(UnitType);

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold">{province.name}</h2>
        <div className="text-sm text-gray-400">
          {province.isCapital && (
            <span className="inline-block bg-yellow-600 text-yellow-100 px-2 py-1 rounded text-xs mr-2">
              Столица
            </span>
          )}
          Население: {province.population.toLocaleString()}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-600 mb-4">
        {[
          { id: 'info', label: 'Информация' },
          { id: 'buildings', label: 'Здания' },
          { id: 'units', label: 'Войска' },
          { id: 'production', label: 'Производство' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-2 text-sm font-medium border-b-2 ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Ресурсы</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Людские ресурсы: {province.resources.manpower}</div>
              <div>Сталь: {province.resources.steel}</div>
              <div>Нефть: {province.resources.oil}</div>
              <div>Продовольствие: {province.resources.food}</div>
              <div>Деньги: {province.resources.money}</div>
              <div>Исследования: {province.resources.research}</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Состояние</h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Мораль</span>
                  <span>{province.morale}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${province.morale}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span>Инфраструктура</span>
                  <span>{province.infrastructure}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${province.infrastructure}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'buildings' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Существующие здания</h3>
            <div className="space-y-2">
              {province.buildings.length === 0 ? (
                <div className="text-gray-400 text-sm">Нет зданий</div>
              ) : (
                province.buildings.map(building => {
                  const Icon = getBuildingIcon(building.type);
                  return (
                    <div key={building.id} className="flex items-center space-x-2 p-2 bg-gray-700 rounded">
                      <Icon className="w-4 h-4" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{building.type}</div>
                        <div className="text-xs text-gray-400">Уровень {building.level}</div>
                      </div>
                      {building.isUnderConstruction && (
                        <div className="text-xs text-yellow-400">
                          Строится ({building.constructionTimeLeft} дней)
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {canControl && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Построить здание</h3>
              <div className="grid grid-cols-2 gap-2">
                {availableBuildings.map(buildingType => {
                  const Icon = getBuildingIcon(buildingType);
                  return (
                    <button
                      key={buildingType}
                      onClick={() => onBuildingConstruction(province.id, buildingType)}
                      className="flex items-center space-x-2 p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs">{buildingType}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'units' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Войска в провинции</h3>
            <div className="space-y-2">
              {province.units.length === 0 ? (
                <div className="text-gray-400 text-sm">Нет войск</div>
              ) : (
                province.units.map(unit => {
                  const Icon = getUnitIcon(unit.type);
                  return (
                    <div key={unit.id} className="flex items-center space-x-2 p-2 bg-gray-700 rounded">
                      <Icon className="w-4 h-4" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{unit.name}</div>
                        <div className="text-xs text-gray-400">{unit.type}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs">HP: {unit.health}/{unit.maxHealth}</div>
                        <div className="text-xs">Мораль: {unit.morale}%</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'production' && canControl && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Производить войска</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableUnits.map(unitType => {
                const Icon = getUnitIcon(unitType);
                return (
                  <button
                    key={unitType}
                    onClick={() => onUnitProduction(province.id, unitType)}
                    className="flex items-center space-x-2 p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{unitType}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Очередь производства</h3>
            <div className="text-sm text-gray-400">
              Функция в разработке
            </div>
          </div>
        </div>
      )}

      {!canControl && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-500/20 rounded">
          <div className="text-red-400 text-sm">
            Вы не можете управлять этой провинцией
          </div>
        </div>
      )}
    </div>
  );
};