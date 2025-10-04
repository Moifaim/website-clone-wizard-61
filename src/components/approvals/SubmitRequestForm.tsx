import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

export function SubmitRequestForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    position: "",
    manager: "",
    trainingTitle: "",
    domain: "Cybersécurité",
    provider: "",
    startDate: "",
    endDate: "",
    mode: "presentiel",
    budget: "",
    impact: "Certification",
    justification: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Demande soumise pour approbation ✅",
      description: "Votre demande sera traitée par votre manager.",
    });
  };

  const handleSaveDraft = () => {
    toast({
      title: "Brouillon enregistré",
      description: "Vous pouvez reprendre votre demande plus tard.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <form onSubmit={handleSubmit} className="lg:col-span-2 bg-card rounded-2xl border shadow-soft p-6 space-y-5">
        <h2 className="text-base font-semibold">Demande de formation</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Nom complet</Label>
            <Input
              id="fullName"
              placeholder="Ex. Lionel Togbe"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="email">Email professionnel</Label>
            <Input
              id="email"
              type="email"
              placeholder="prenom.nom@entreprise.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="position">Poste / Équipe</Label>
            <Input
              id="position"
              placeholder="Admin Systèmes — IT Ops"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="manager">Manager</Label>
            <Input
              id="manager"
              placeholder="Ex. Marie Dupont"
              value={formData.manager}
              onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="trainingTitle">Intitulé de la formation</Label>
            <Input
              id="trainingTitle"
              placeholder="Ex. Kubernetes Administration (CKA)"
              value={formData.trainingTitle}
              onChange={(e) => setFormData({ ...formData, trainingTitle: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="domain">Domaine</Label>
            <Select value={formData.domain} onValueChange={(value) => setFormData({ ...formData, domain: value })}>
              <SelectTrigger id="domain">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cybersécurité">Cybersécurité</SelectItem>
                <SelectItem value="Cloud">Cloud</SelectItem>
                <SelectItem value="DevOps">DevOps</SelectItem>
                <SelectItem value="Développement">Développement</SelectItem>
                <SelectItem value="Réseaux">Réseaux</SelectItem>
                <SelectItem value="Data/IA">Data/IA</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="provider">Organisme / Lien</Label>
            <Input
              id="provider"
              type="url"
              placeholder="https://… (brochure/programme)"
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label className="mb-2 block">Mode</Label>
            <RadioGroup value={formData.mode} onValueChange={(value) => setFormData({ ...formData, mode: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="presentiel" id="presentiel" />
                <Label htmlFor="presentiel" className="font-normal">Présentiel</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="enligne" id="enligne" />
                <Label htmlFor="enligne" className="font-normal">En ligne</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hybride" id="hybride" />
                <Label htmlFor="hybride" className="font-normal">Hybride</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="budget">Budget estimé (€)</Label>
            <Input
              id="budget"
              type="number"
              min="0"
              step="50"
              placeholder="Ex. 1800"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="impact">Impact attendu</Label>
            <Select value={formData.impact} onValueChange={(value) => setFormData({ ...formData, impact: value })}>
              <SelectTrigger id="impact">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Certification">Certification</SelectItem>
                <SelectItem value="Montée en compétences">Montée en compétences</SelectItem>
                <SelectItem value="Mobilité interne">Mobilité interne</SelectItem>
                <SelectItem value="Conformité/Sécurité">Conformité/Sécurité</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="justification">Objectifs & justification</Label>
          <Textarea
            id="justification"
            rows={4}
            placeholder="Expliquez brièvement le besoin, le ROI attendu, les projets impactés…"
            value={formData.justification}
            onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
          />
        </div>

        <div>
          <Label className="block mb-2">Pièces jointes (PDF, devis…)</Label>
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl p-6 hover:border-brand-400 cursor-pointer text-muted-foreground text-sm transition-colors">
            <Upload className="h-6 w-6" />
            <span><strong className="text-foreground">Glissez-déposez</strong> ou cliquez pour sélectionner</span>
            <input type="file" className="hidden" multiple />
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={handleSaveDraft}>
            Enregistrer brouillon
          </Button>
          <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
            Soumettre la demande
          </Button>
        </div>
      </form>

      <aside className="bg-gradient-to-br from-brand-50 to-white border rounded-2xl p-6 shadow-soft">
        <h3 className="text-sm font-semibold mb-3">Aide & Processus</h3>
        <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
          <li>Soumettre la demande avec le programme et le budget.</li>
          <li>Approbation manager ➜ RH Formation.</li>
          <li>Validation budget & planification.</li>
          <li>Inscription et suivi (email/ICS).</li>
        </ol>

        <div className="mt-6">
          <h4 className="text-sm font-semibold mb-2">Bonnes pratiques</h4>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
            <li>Relier la formation à un projet concret.</li>
            <li>Préciser l'impact attendu (qualité, sécurité, délais).</li>
            <li>Joindre un devis/brochure pour accélérer l'accord.</li>
          </ul>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-white border">
          <p className="text-xs text-muted-foreground">
            Astuce : après validation, un événement calendrier (ICS) peut être généré automatiquement et une tâche de suivi créée.
          </p>
        </div>
      </aside>
    </div>
  );
}
