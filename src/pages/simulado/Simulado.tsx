import { useEffect, useState } from "react"
import { Pergunta } from "./pergunta/Pergunta"
import { useApi } from "../../services/useAPI";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import type { SimuladoAtivoResponse, Questao } from "../../interfaces/simulado/simulado-ativo.interface";
import SimuladoPendente from "./pendente/SimuladoPendente";
import { ListasPerguntas } from "./pergunta/ListasPerguntas";
import { Temporizador } from "./temporizador/Temporizador";

export const Simulado = () => {
    const { request, isLoading } = useApi();
    const [ simuladoAtivo, setSimuladoAtivo ] = useState<SimuladoAtivoResponse | null>(null);
    const [ mostrarPergunta, setMostrarPergunta ] = useState(false);
    const [ indiceAtual, setIndiceAtual ] = useState(0);
    const [ respostas, setRespostas ] = useState<Record<number, "A" | "B" | "C" | "D">>({});
    const [ abrirConfirmacao, setAbrirConfirmacao ] = useState(false);
    const [ faltantes, setFaltantes ] = useState(0);
    const [ tempoEsgotado, setTempoEsgotado ] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        request('/api/simulado/ativo', {
            method: 'GET',
            withAuth: true
        }).then((data) => {
            // 200 → data com simulado em andamento
            // 204 → useApi retorna null → redireciona para criação
            if (!data) {
                navigate('/simulado/criar');
            } else {
                const d = data as SimuladoAtivoResponse;
                setSimuladoAtivo(d);
            }
        }).catch((err) => {
            console.error('Erro ao verificar simulado ativo:', err);
            navigate('/dashboard');
        });
    }, []);

    const questoes: Questao[] = simuladoAtivo?.questoes ?? [];
    const totalQuestoes = questoes.length;

    const handleSelecionarAlternativa = (alternativa: "A" | "B" | "C" | "D") => {
        if (tempoEsgotado) return;
        const atual = questoes[indiceAtual];
        if (!atual) return;
        setRespostas((prev) => ({
            ...prev,
            [atual.id]: alternativa,
        }));
    };

    const irParaQuestao = (novoIndice: number) => {
        if (tempoEsgotado) return;
        if (novoIndice < 0 || novoIndice >= totalQuestoes) return;
        setIndiceAtual(novoIndice);
    };

    const handleAnterior = () => {
        irParaQuestao(indiceAtual - 1);
    };

    const handleProxima = () => {
        irParaQuestao(indiceAtual + 1);
    };

    const finalizarDefinitivo = () => {
        if (simuladoAtivo) {
            try {
                window.localStorage.removeItem(`simulado_inicio_${simuladoAtivo.id}`);
            } catch {
                // ignore falhas de limpeza do localStorage
            }
        }
        console.log("Respostas do simulado:", respostas);
    };

    const handleFinalizarSimulado = () => {
        const respondidas = questoes.filter((q) => respostas[q.id]).length;
        const faltantesCalculado = totalQuestoes - respondidas;

        if (faltantesCalculado > 0) {
            setFaltantes(faltantesCalculado);
            setAbrirConfirmacao(true);
            return;
        }

        finalizarDefinitivo();
    };

    if (isLoading) {
        return (
            <Box
                sx={{
                    minHeight: "60vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                }}
            >
                <CircularProgress />
                <Typography variant="body1" color="text.secondary">
                    Carregando simulado...
                </Typography>
            </Box>
        );
    }

    if (simuladoAtivo && !mostrarPergunta) {
        return (
            <SimuladoPendente
                data={simuladoAtivo}
                onContinuar={() => setMostrarPergunta(true)}
            />
        );
    }

    if (simuladoAtivo && mostrarPergunta) {
        const questaoAtual = questoes[indiceAtual];

        if (!questaoAtual) {
            return null;
        }

        const alternativaSelecionada = respostas[questaoAtual.id] ?? null;
        const isPrimeira = indiceAtual === 0;
        const isUltima = indiceAtual === totalQuestoes - 1;

        const duracaoTotalSegundos = simuladoAtivo.tempoDuracao * 60;

        const storageKeyInicio = `simulado_inicio_${simuladoAtivo.id}`;
        let duracaoInicialSegundos = duracaoTotalSegundos;

        try {
            const salvo = window.localStorage.getItem(storageKeyInicio);
            if (salvo) {
                const inicioMs = Number(salvo);
                if (!Number.isNaN(inicioMs) && inicioMs > 0) {
                    const agora = Date.now();
                    const decorrido = Math.floor((agora - inicioMs) / 1000);
                    duracaoInicialSegundos = Math.max(duracaoTotalSegundos - decorrido, 0);
                }
            } else {
                // primeira vez que o usuário entra no simulado neste navegador
                window.localStorage.setItem(storageKeyInicio, String(Date.now()));
            }
        } catch {
            // se localStorage não estiver disponível, cai no comportamento original
            duracaoInicialSegundos = duracaoTotalSegundos;
        }

        const handlePausarESair = () => {
            // Apenas navega para fora mantendo o simulado pendente
            navigate('/dashboard');
        };

        const handleTempoEsgotado = () => {
            setTempoEsgotado(true);
        };

        return (
            <>
                <Box
                    sx={{
                        display: "flex",
                        gap: 3,
                        alignItems: { xs: "stretch", md: "flex-start" },
                        flexDirection: { xs: "column", md: "row" },
                        height: { xs: "auto", md: "calc(100vh - 160px)" },
                    }}
                >
                    <Box
                        sx={{
                            flexBasis: { xs: "100%", md: "80%" },
                            flexShrink: 0,
                            pr: { xs: 0, md: 2 },
                            overflowY: "auto",
                            display: "flex",
                            gap: 2,
                        }}
                    >
                        {/* Conteúdo da pergunta e temporizador */}
                        <Box
                            sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                alignItems: { xs: "stretch", md: "flex-start" },
                                justifyContent: "center",
                                gap: 2,
                            }}
                        >
                            {/* Card de temporizador */}
                            <Temporizador
                                duracaoInicialSegundos={duracaoInicialSegundos}
                                onTempoEsgotado={handleTempoEsgotado}
                                onPausarESair={handlePausarESair}
                            />
                            <Pergunta
                                questao={questaoAtual}
                                indice={indiceAtual}
                                total={totalQuestoes}
                                alternativaSelecionada={alternativaSelecionada}
                                onSelecionarAlternativa={handleSelecionarAlternativa}
                                onAnterior={handleAnterior}
                                onProxima={handleProxima}
                                isPrimeira={isPrimeira}
                                isUltima={isUltima}
                                onFinalizar={handleFinalizarSimulado}
                                bloqueado={tempoEsgotado}
                            />
                        </Box>

                      
                    </Box>

                    {/* Lista lateral de questões (20%) */}
                    <ListasPerguntas
                        questoes={questoes}
                        indiceAtual={indiceAtual}
                        respostas={respostas}
                        onIrParaQuestao={irParaQuestao}
                        onFinalizarSimulado={handleFinalizarSimulado}
                    />
                </Box>

                <Dialog
                    open={abrirConfirmacao}
                    onClose={() => setAbrirConfirmacao(false)}
                >
                    <DialogTitle>Finalizar simulado?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Você ainda tem {faltantes} questão{faltantes > 1 ? "s" : ""} sem responder.
                            Deseja realmente finalizar o simulado assim mesmo?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setAbrirConfirmacao(false)} color="inherit">
                            Voltar
                        </Button>
                        <Button
                            onClick={() => {
                                setAbrirConfirmacao(false);
                                finalizarDefinitivo();
                            }}
                            color="primary"
                            variant="contained"
                        >
                            Finalizar mesmo assim
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }

    return null;
}