program  Maxmin;

var

    x, y : integer;

begin

    writeln ('entre com dois valores: ');

    readln (x, y);

    if  x > y              { neste caso x e maior que y }

        then

            begin

                writeln ('o maior e  ', x);

                writeln ('o menor e  ', y);

            end

        else                 { neste caso y e maior que x }

            begin

                writeln ('o maior e = ', y);

                writeln ('o menor e = ', x);

            end;

end.