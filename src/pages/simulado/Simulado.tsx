import { useEffect, useState } from "react"
import { Pergunta } from "./pergunta/Pergunta"
import { useApi } from "../../services/useAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import type { SimuladoAtivoResponse, Questao } from "../../interfaces/simulado/simulado-ativo.interface";
import SimuladoPendente from "./pendente/SimuladoPendente";
import { ListasPerguntas } from "./pergunta/ListasPerguntas";
import { Temporizador } from "./temporizador/Temporizador";
import type { SimuladoFinalizadoResponse } from "../../interfaces/simulado/responder-simulado.interface";
import { enqueueSnackbar } from "notistack";

type SimuladoLocationState = {
    mostrarPergunta?: boolean;
};
export const Simulado = () => {
    const { request, isLoading } = useApi();
    const [ simuladoAtivo, setSimuladoAtivo ] = useState<SimuladoAtivoResponse | null>(null);
    const location = useLocation();
    const mostrarPerguntaState = Boolean((location.state as SimuladoLocationState | null)?.mostrarPergunta);
    const mostrarPerguntaParam = new URLSearchParams(location.search).get("mostrarPergunta") === "true";
    const [ mostrarPergunta, setMostrarPergunta ] = useState(mostrarPerguntaState || mostrarPerguntaParam);
    const [ indiceAtual, setIndiceAtual ] = useState(0);
    const [ respostas, setRespostas ] = useState<Record<number, "A" | "B" | "C" | "D">>({});
    const [ abrirConfirmacao, setAbrirConfirmacao ] = useState(false);
    const [ faltantes, setFaltantes ] = useState(0);
    const [ tempoEsgotado, setTempoEsgotado ] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();

        request('/api/simulado/ativo', {
            method: 'GET',
            withAuth: true,
            signal: controller.signal
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
            if (err?.name === 'AbortError') {
                return;
            }
            console.error('Erro ao verificar simulado ativo:', err);
            enqueueSnackbar('Erro ao carregar simulado ativo. Tente novamente mais tarde.', { variant: 'error' });
            navigate('/dashboard');
        });

        return () => {
            controller.abort();
        };
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
                request(`/api/simulado/${simuladoAtivo.id}/responder`, {
                    method: 'POST',
                    withAuth: true,
                    body: {
                        simuladoId: simuladoAtivo.id,
                        respostas: Object.entries(respostas).map(([questaoId, respostaUsuario]) => ({
                            questaoId: Number(questaoId),
                            respostaUsuario
                        }))
                    }
                }).then((data) => { 
                    window.localStorage.removeItem(`simulado_tempo_restante_${simuladoAtivo.id}`);
                    const d = data as SimuladoFinalizadoResponse;
                    navigate('/simulado/resultado', { state: { resultado: d, nomeSimulado: simuladoAtivo.titulo} });
                }).catch((err) => {
                    enqueueSnackbar('Responda ao menos uma questão para finalizar o simulado.', { variant: 'warning' });
                    console.error('Erro ao finalizar simulado:', err);    
                });
        }
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

        const handlePausarESair = () => {
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
                                simuladoId={simuladoAtivo.id}
                                duracaoTotalSegundos={duracaoTotalSegundos}
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