from fastapi import APIRouter

router = APIRouter()

@router.get("/commodities")
def get_commodities():
    pass

@router.post("/calculate")
def calculate():
    pass

@router.post("/validate")
def validate():
    pass
