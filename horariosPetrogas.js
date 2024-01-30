
function verificarAtualizacao(codigo) {
    const horarioAtual = new Date();
    const diaSemana = horarioAtual.getDay(); // 0 para Domingo, 1 para Segunda, ..., 6 para Sábado
    const hora = horarioAtual.getHours();

    switch (codigo) {
        case 10008: // Wangly
            if (diaSemana >= 1 && diaSemana <= 5) { // Segunda a Sexta
                if (hora >= 7 && hora <= 8) {
                    return "Entrada";
                } else if (hora >= 13 && hora <= 14) {
                    return "Saida";
                } else {
                    return "Anomalia";
                }
            }
            break;

        case 10005: // Debora
            if (diaSemana >= 1 && diaSemana <= 5) { // Segunda a Sexta
                if (hora >= 14 && hora <= 15) {
                    return "Entrada";
                } else if (hora >= 20 && hora <= 21) {
                    return "Saida";
                } else {
                    return "Anomalia";
                }
            }
            break;

        default:
            return null;
    }
}
