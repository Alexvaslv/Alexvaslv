import { Settings } from "lucide-react";

interface GraphicsSettingsProps {
  settings: { bloom: boolean; ambientOcclusion: boolean; shadowQuality: 'low' | 'medium' | 'high' };
  onUpdate: (settings: any) => void;
}

export default function GraphicsSettings({ settings, onUpdate }: GraphicsSettingsProps) {
  return (
    <div className="bg-gray-900/50 border border-white/10 rounded-3xl p-6 flex flex-col gap-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-white" />
        <h2 className="text-lg font-bold uppercase tracking-widest text-white">Графика</h2>
      </div>
      
      <div className="flex flex-col gap-4">
        <label className="flex items-center justify-between">
          <span className="text-sm text-white/70">Bloom</span>
          <input 
            type="checkbox" 
            checked={settings.bloom} 
            onChange={(e) => onUpdate({ ...settings, bloom: e.target.checked })}
            className="w-5 h-5 accent-emerald-500"
          />
        </label>
        
        <label className="flex items-center justify-between">
          <span className="text-sm text-white/70">Ambient Occlusion</span>
          <input 
            type="checkbox" 
            checked={settings.ambientOcclusion} 
            onChange={(e) => onUpdate({ ...settings, ambientOcclusion: e.target.checked })}
            className="w-5 h-5 accent-emerald-500"
          />
        </label>
        
        <div className="flex flex-col gap-2">
          <span className="text-sm text-white/70">Shadow Quality</span>
          <select 
            value={settings.shadowQuality}
            onChange={(e) => onUpdate({ ...settings, shadowQuality: e.target.value })}
            className="bg-gray-800 border border-white/10 rounded-lg p-2 text-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </div>
  );
}
