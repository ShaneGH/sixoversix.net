
interface LinqStatic {
    (): Linq;
    (input: any[]): Linq;
    (input: NodeList): Linq;
    (input: Linq): Linq;
}

interface Linq {
    new(input: Array);
    Result: any[];
    Aggregate(lambda: string) : Linq;
    Aggregate(lambda: Function) : Linq;
    Aggregate() : Linq;
    Any(lambda: string) : Boolean;
    Any(lambda: Function) : Boolean;
    Contains(item): Boolean;
    Distinct() : Linq;
    Each(lambda: string) : Linq;
    Each(lambda: Function) : Linq;
    First(lambda: string) : any;
    First(lambda: Function) : any;
    GroupBy(lambda: string) : Linq;
    GroupBy(lambda: Function) : Linq;
    Last(lambda: string) : any;
    Last(lambda: Function) : any;
    Max(lambda: string) : any;
    Max(lambda: Function) : any;
    Min(lambda: string) : any;
    Min(lambda: Function) : any;
    OrderBy(lambda: string) : Linq;
    OrderBy(lambda: Function) : Linq;
    OrderByDecending(lambda: string) : Linq;
    OrderByDecending(lambda: Function) : Linq;
    ReverseEach(lambda: string) : Linq;
    ReverseEach(lambda: Function) : Linq;
    Select(lambda: string) : Linq;
    Select(lambda: Function) : Linq;
    Skip(amount: Number) : Linq;
    Take(amount: Number) : Linq;
    Union(union: Linq) : Linq;
    Union(union: any[]) : Linq;
    Where(lambda: string) : Linq;
    Where(lambda: Function) : Linq;
}

declare var linq: LinqStatic;