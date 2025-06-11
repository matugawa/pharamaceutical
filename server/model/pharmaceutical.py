from pydantic import BaseModel
from typing import Optional


class Pharmaceutical(BaseModel):
    category: Optional[str]
    drug_code: Optional[str]
    ingredient: Optional[str]
    specification: Optional[str]
    product: Optional[str]
    manufacturer: Optional[str]
    eligible_generic: Optional[str]
    brand_generic: Optional[str]
    brand_generic_with_generic: Optional[str]
    price: Optional[float]
    expirary_date: Optional[str]
    remarks: Optional[str]
    previouse_price: Optional[float] = None


class Ingredient(BaseModel):
    ingredient: str
    pharmaceuticals: list[Pharmaceutical]
    

class IngredientList(BaseModel):
    ingredients: list[Ingredient]
