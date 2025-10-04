import { TrendingUp } from "lucide-react";

export function StatsPanel() {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-2xl p-5 shadow-soft">
          <p className="text-xs text-muted-foreground">Demandes ce trimestre</p>
          <p className="text-3xl font-semibold">28</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="h-3 w-3" />
            +12% vs T-1
          </div>
        </div>
        <div className="bg-card border rounded-2xl p-5 shadow-soft">
          <p className="text-xs text-muted-foreground">Taux d'approbation</p>
          <p className="text-3xl font-semibold">73%</p>
          <div className="mt-2 text-xs text-muted-foreground">Objectif ≥ 70%</div>
        </div>
        <div className="bg-card border rounded-2xl p-5 shadow-soft">
          <p className="text-xs text-muted-foreground">Budget engagé</p>
          <p className="text-3xl font-semibold">34 250 €</p>
          <div className="mt-2 text-xs text-muted-foreground">Plafond trimestriel : 50 000 €</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card border rounded-2xl p-5 shadow-soft">
          <h4 className="text-sm font-semibold mb-3">Domaines les plus demandés</h4>
          <ul className="text-sm space-y-2">
            <li className="flex items-center justify-between">
              <span>DevOps</span>
              <span className="text-muted-foreground">10 demandes</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Cybersécurité</span>
              <span className="text-muted-foreground">7 demandes</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Cloud</span>
              <span className="text-muted-foreground">6 demandes</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Développement</span>
              <span className="text-muted-foreground">3 demandes</span>
            </li>
          </ul>
        </div>
        <div className="bg-card border rounded-2xl p-5 shadow-soft">
          <h4 className="text-sm font-semibold mb-3">Historique d'activité</h4>
          <ol className="text-sm space-y-2">
            <li>
              REQ-0241 — <span className="text-muted-foreground">Soumise par Lionel</span>
            </li>
            <li>
              REQ-0227 — <span className="text-muted-foreground">Approuvée par Manager</span>
            </li>
            <li>
              REQ-0212 — <span className="text-muted-foreground">Refusée (budget dépassé)</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
