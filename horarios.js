
function verificarAtualizacao(codigo) {
    const horarioAtual = new Date();
    const diaSemana = horarioAtual.getDay(); // 0 para Domingo, 1 para Segunda, ..., 6 para Sábado
    const hora = horarioAtual.getHours();

    switch (codigo) {
        case 10003: // Igor
            if (diaSemana >= 1 && diaSemana <= 5) { // Segunda a Sexta
                if (hora >= 7 && hora <= 8) {
                    return "Entrada";
                } else if (hora >= 12 && hora <= 13) {
                    return "Pausa";
                } else if (hora >= 14 && hora <= 15) {
                    return "Retorno";
                } else if (hora >= 17 && hora <= 18) {
                    return "Saida";
                } else {
                    return "Anomalia";
                }
            }
            break;

        case 10005: // Debora
            if (diaSemana >= 1 && diaSemana <= 5) { // Segunda a Sexta
                if (hora >= 7 && hora <= 8) {
                    return "Entrada";
                } else if (hora >= 12 && hora <= 13) {
                    return "Pausa";
                } else if (hora >= 14 && hora <= 15) {
                    return "Retorno";
                } else if (hora >= 17 && hora <= 18) {
                    return "Saida";
                } else {
                    return "Anomalia";
                }
            }
            break;

        case 10006: // Carla
            if (diaSemana >= 1 && diaSemana <= 5) { // Segunda a Sexta
                if (hora >= 9 && hora <= 10) {
                    return "Entrada";
                } else if (hora >= 13 && hora <= 14) {
                    return "Pausa";
                } else if (hora >= 16 && hora <= 17) {
                    return "Retorno";
                } else if (hora >= 19 && hora <= 20) {
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
