var mth1 = 0

function Macro_Math_pomnoz(aram11,aram22,aret33){
    fld aram11
    fmul aram22
    fstp aret33
}

function Macro_Math_dodaj(aram11,aram22,aret33){
    fld aram11
    fadd aram22
    fstp aret33
}

function Macro_Math_podziel(aram11,aram22,aret33){
    fld aram11
    fdiv aram22
    fstp aret33
}

function Macro_Math_odejmnij(aram11,aram22,aret33){
    fld aram11
    fsub aram22
    fstp aret33
}



/*
    

.code
    Macro_Math_sin macro aram11,aret33
    

    fld aram11

    fsin

    fstp aret33


    endm



.code
    Macro_Math_cos macro aram11,aret33
    

    fld aram11

    fcos

    fstp aret33


    endm



.code
    Macro_Math_sqrt macro aram11,aret33
    

    fld aram11

    fsqrt

    fstp aret33


    endm





.code
    Macro_Math_tan macro aram11,aret33
    

    Macro_Math_sin aram11,stp1

    Macro_Math_cos aram11,stp2

    fld stp1

    fdiv stp2

    fstp aret33


    endm



.code
    Macro_Math_Deg2Rad macro aram11,aret33
    

    fld aram11

    fmul deg2rad

    fstp aret33


    endm

    */