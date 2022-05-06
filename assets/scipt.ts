interface Veiculo{
    nome: string;
    placa: string;
    entrada: Date | string;
}

(function(){
    const $ = (query: string):HTMLInputElement | null=> document.querySelector(query);

    function calcTempo(mil: number){
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);
        
        return `${min}m e ${sec}s`
    }

    function patio(){
        function ler():Veiculo[]{
            return localStorage.patio?JSON.parse(localStorage.patio) : []
        }

        function adicionar(veiculo: Veiculo, salva?:boolean){
            const ROW = document.createElement("tr");
            ROW.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entrada}</td>
            <td>
                <button class="delete" data-placa="${veiculo.placa}">X</button>
            </td>
            `;

            ROW.querySelector(".delete")?.addEventListener('click',function(){
                remover(this.dataset.placa)
            })

            $("#patio")?.appendChild(ROW);
            if(salva) salvar([...ler(), veiculo]);
        }

        function remover(placa: string){
            const {entrada, nome} = ler().find(
                veiculo => veiculo.placa === placa
            );

            const TEMPO = calcTempo(
                new Date().getTime() - new Date(entrada).getTime()
            );
            if(
                !confirm(`O veiculo ${nome} permaneceu por ${TEMPO}. Deseja remover o carro?`)
            )
            return;

            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            render();

        }

        function salvar(veiculos: Veiculo[]){
            localStorage.setItem("patio", JSON.stringify(veiculos))
        }

        function render(){
            $("#patio")!.innerHTML = "";
            const PATIO = ler();
            if(PATIO.length){
                PATIO.forEach(veiculo => adicionar(veiculo))
            }
        }
        return {ler, adicionar, remover, salvar, render};
    }

    patio().render()

    $("#cadastrar")?.addEventListener("click",()=>{
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;
        console.log({nome, placa});
        if(!nome || !placa){
            alert("Os campos nome e placa são obrigatórios");
            return;
        }
        
        patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
    });
})();