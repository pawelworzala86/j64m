var mth1 = 0

function Macro_Math_pomnoz(aram11,aram22,aret33){
    fld aram11
    fmul aram22
    fstp aret33
}

/*

.code
    Macro_Math_dodaj macro aram11,aram22,aret33
    

    fld qword ptr aram11

    fadd qword ptr aram22

    fstp qword ptr aret33


    endm



.code
    Macro_Math_podziel macro aram11,aram22,aret33
    

    fld qword ptr aram11

    fdiv qword ptr aram22

    fstp qword ptr aret33


    endm



.code
    Macro_Math_odejmnij macro aram11,aram22,aret33
    

    fld qword ptr aram11

    fsub qword ptr aram22

    fstp qword ptr aret33


    endm




    

.code
    Macro_Math_sin macro aram11,aret33
    

    fld qword ptr aram11

    fsin

    fstp qword ptr aret33


    endm



.code
    Macro_Math_cos macro aram11,aret33
    

    fld qword ptr aram11

    fcos

    fstp qword ptr aret33


    endm



.code
    Macro_Math_sqrt macro aram11,aret33
    

    fld qword ptr aram11

    fsqrt

    fstp qword ptr aret33


    endm





.code
    Macro_Math_tan macro aram11,aret33
    

    Macro_Math_sin aram11,stp1

    Macro_Math_cos aram11,stp2

    fld qword ptr stp1

    fdiv qword ptr stp2

    fstp qword ptr aret33


    endm



.code
    Macro_Math_Deg2Rad macro aram11,aret33
    

    fld qword ptr aram11

    fmul qword ptr deg2rad

    fstp qword ptr aret33


    endm

    */