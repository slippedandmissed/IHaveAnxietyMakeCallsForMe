import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { ForumComponent } from './pages/forum/forum.component';
import { UserDataService } from './services/user-data.service';
import { ChangesMadeGuard } from './guards/changes-made.guard';
import { MessagesComponent } from './pages/messages/messages.component';

const routes: Routes = [
  { path: "", component: HomepageComponent },
  { path: "forum", component: ForumComponent, canActivate: [UserDataService], canDeactivate: [ChangesMadeGuard] },
  { path: "messages", component: MessagesComponent, canActivate: [UserDataService] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
