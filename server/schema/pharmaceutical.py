from typing import Optional
import strawberry


@strawberry.type
class Pharmaceutical:
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
    previouse_price: Optional[float]


@strawberry.type
class Ingredient:
    ingredient: str
    pharmaceuticals: list[Pharmaceutical]
    
@strawberry.type
class IngredientList:
    ingredients: list[Ingredient]


@strawberry.input
class PharmaceuticalSearch:
    category: Optional[str]
    search_name: str
    specification: Optional[str]
