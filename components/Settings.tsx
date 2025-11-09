'use client';

import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, X, RotateCcw, Eye, EyeOff } from 'lucide-react';

interface SettingsProps {
  onWidgetToggle: (widgetId: string, enabled: boolean) => void;
  onResetLayout: () => void;
  enabledWidgets: Set<string>;
  allWidgets: { id: string; name: string }[];
}

export function Settings({ onWidgetToggle, onResetLayout, enabledWidgets, allWidgets }: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 bg-card border border-card-border rounded-lg p-2 hover:border-accent/50 transition-colors shadow-lg z-40"
        aria-label="Open settings"
      >
        <SettingsIcon className="w-4 h-4" />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-card-border rounded-lg p-4 w-full max-w-md max-h-[80vh] overflow-y-auto z-50 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Dashboard Settings</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-accent/10 rounded transition-colors"
                aria-label="Close settings"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reset Layout */}
            <div className="mb-6">
              <button
                onClick={() => {
                  onResetLayout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-accent/10 hover:bg-accent/20 text-accent px-4 py-2 rounded transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Layout to Default
              </button>
            </div>

            {/* Widget Toggles */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted">Visible Widgets</h3>
              <div className="space-y-2">
                {allWidgets.map((widget) => {
                  const isEnabled = enabledWidgets.has(widget.id);
                  return (
                    <label
                      key={widget.id}
                      className="flex items-center justify-between p-2 hover:bg-accent/5 rounded cursor-pointer transition-colors"
                    >
                      <span className="text-sm">{widget.name}</span>
                      <button
                        onClick={() => onWidgetToggle(widget.id, !isEnabled)}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                          isEnabled
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-red-500/20 text-red-500'
                        }`}
                      >
                        {isEnabled ? (
                          <>
                            <Eye className="w-3 h-3" />
                            Visible
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            Hidden
                          </>
                        )}
                      </button>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-card-border">
              <p className="text-xs text-muted text-center">
                Drag widgets to rearrange them on your dashboard
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
