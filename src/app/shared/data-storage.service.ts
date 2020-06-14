import { AuthService } from './../auth/auth.service';
import { Recipe } from './../recipes/recipe.model';
import { RecipeService } from './../recipes/recipe.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DataStorageService {

  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) {

  }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://recipes-9942d.firebaseio.com/recipes.json', recipes).subscribe(
      (responseData) => {
        console.log(responseData);
      }
    );
  }

  fetchRecipes() {
      return this.http.get<Recipe[]>('https://recipes-9942d.firebaseio.com/recipes.json').pipe(
        map(
          (recipes) => {
            return recipes.map( (recipe) => {
              return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
            });
          }
        ),
        tap(
          (storedRecipes) => {
            this.recipeService.setRecipes(storedRecipes);
          }
        )
      );
  }

}
