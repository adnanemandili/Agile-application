import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'agileProjectApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'classe',
    data: { pageTitle: 'agileProjectApp.classe.home.title' },
    loadChildren: () => import('./classe/classe.routes'),
  },
  {
    path: 'etudiant',
    data: { pageTitle: 'agileProjectApp.etudiant.home.title' },
    loadChildren: () => import('./etudiant/etudiant.routes'),
  },
  {
    path: 'matiere',
    data: { pageTitle: 'agileProjectApp.matiere.home.title' },
    loadChildren: () => import('./matiere/matiere.routes'),
  },
  {
    path: 'professeur',
    data: { pageTitle: 'agileProjectApp.professeur.home.title' },
    loadChildren: () => import('./professeur/professeur.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
