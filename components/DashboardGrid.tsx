'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableWidget } from './SortableWidget';
import { Settings } from './Settings';
import { Clock } from './Clock';
import { Weather } from './Weather';
import { Crypto } from './Crypto';
import { HackerNews } from './HackerNews';
import { GitHubTrending } from './GitHubTrending';
import { TechQuote } from './TechQuote';
import { TechStocks } from './TechStocks';
import { StockMovers } from './StockMovers';
import { BioinfoRepos } from './BioinfoRepos';
import { BiotechNews } from './BiotechNews';

// Widget registry - maps widget IDs to their components and metadata
const WIDGET_COMPONENTS = {
  clock: Clock,
  weather: Weather,
  crypto: Crypto,
  techStocks: TechStocks,
  techQuote: TechQuote,
  stockMovers: StockMovers,
  hackerNews: HackerNews,
  githubTrending: GitHubTrending,
  bioinfoRepos: BioinfoRepos,
  biotechNews: BiotechNews,
};

const WIDGET_NAMES = {
  clock: 'Clock',
  weather: 'Weather',
  crypto: 'Crypto Prices',
  techStocks: 'Tech Stocks',
  techQuote: 'Tech Quote',
  stockMovers: "Today's Movers",
  hackerNews: 'Hacker News',
  githubTrending: 'GitHub Trending',
  bioinfoRepos: 'Bioinfo Repos',
  biotechNews: 'Biotech News',
};

// Default widget order
const DEFAULT_WIDGETS = [
  'clock',
  'weather',
  'crypto',
  'techStocks',
  'techQuote',
  'stockMovers',
  'hackerNews',
  'githubTrending',
  'bioinfoRepos',
  'biotechNews',
];

export function DashboardGrid() {
  const [widgets, setWidgets] = useState<string[]>(DEFAULT_WIDGETS);
  const [enabledWidgets, setEnabledWidgets] = useState<Set<string>>(new Set(DEFAULT_WIDGETS));
  const [mounted, setMounted] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setMounted(true);

    // Load saved layout from localStorage
    const savedLayout = localStorage.getItem('dashboard-layout');
    if (savedLayout) {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        setWidgets(parsedLayout);
      } catch (error) {
        console.error('Failed to load layout:', error);
      }
    }

    // Load enabled widgets from localStorage
    const savedEnabled = localStorage.getItem('dashboard-enabled');
    if (savedEnabled) {
      try {
        const parsedEnabled = JSON.parse(savedEnabled);
        setEnabledWidgets(new Set(parsedEnabled));
      } catch (error) {
        console.error('Failed to load enabled widgets:', error);
      }
    }
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        // Save to localStorage
        localStorage.setItem('dashboard-layout', JSON.stringify(newOrder));

        return newOrder;
      });
    }
  };

  const handleWidgetToggle = (widgetId: string, enabled: boolean) => {
    setEnabledWidgets((prev) => {
      const newSet = new Set(prev);
      if (enabled) {
        newSet.add(widgetId);
      } else {
        newSet.delete(widgetId);
      }
      // Save to localStorage
      localStorage.setItem('dashboard-enabled', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const handleResetLayout = () => {
    setWidgets(DEFAULT_WIDGETS);
    setEnabledWidgets(new Set(DEFAULT_WIDGETS));
    localStorage.setItem('dashboard-layout', JSON.stringify(DEFAULT_WIDGETS));
    localStorage.setItem('dashboard-enabled', JSON.stringify(DEFAULT_WIDGETS));
  };

  const allWidgetsMetadata = DEFAULT_WIDGETS.map((id) => ({
    id,
    name: WIDGET_NAMES[id as keyof typeof WIDGET_NAMES],
  }));

  // Filter to only show enabled widgets
  const visibleWidgets = widgets.filter((id) => enabledWidgets.has(id));

  return (
    <>
      <Settings
        onWidgetToggle={handleWidgetToggle}
        onResetLayout={handleResetLayout}
        enabledWidgets={enabledWidgets}
        allWidgets={allWidgetsMetadata}
      />

      {/* Prevent hydration mismatch for drag-and-drop */}
      {!mounted ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 auto-rows-min">
          {DEFAULT_WIDGETS.map((widgetId) => {
            const WidgetComponent = WIDGET_COMPONENTS[widgetId as keyof typeof WIDGET_COMPONENTS];
            return <WidgetComponent key={widgetId} />;
          })}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={visibleWidgets} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 auto-rows-min">
              {visibleWidgets.map((widgetId) => {
                const WidgetComponent = WIDGET_COMPONENTS[widgetId as keyof typeof WIDGET_COMPONENTS];
                return (
                  <SortableWidget key={widgetId} id={widgetId}>
                    <WidgetComponent />
                  </SortableWidget>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </>
  );
}
