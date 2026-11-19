import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { CalendarModule } from 'primeng/calendar'
import { ChartModule } from 'primeng/chart'
import { InputNumberModule } from 'primeng/inputnumber'
import { InputTextModule } from 'primeng/inputtext'
import { MultiSelectModule } from 'primeng/multiselect'
import { SelectButtonModule } from 'primeng/selectbutton'
import { forkJoin, from, mergeMap, of, toArray, catchError, map } from 'rxjs'
import {
  Cartao,
  Categoria,
  Movimentacao,
  Responsavel,
  TipoPagamento,
} from '../../lib/types'
import { CartaoService } from '../../services/cartao.service'
import { CategoriaService } from '../../services/categoria.service'
import { MovimentacaoService } from '../../services/movimentacao.service'
import { ResponsavelService } from '../../services/responsavel.service'
import { TipoPagamentoService } from '../../services/tipo-pagamento.service'

type Dimensao = 'categoria' | 'responsavel' | 'cartao' | 'tipoPagamento'
type Visao = 'saida' | 'entrada'

interface MovAnalise extends Movimentacao {
  /** Mês de competência (yyyy-MM) – o mês/fatura em que a API a listou */
  mesRef: string
  entrada: boolean
}

interface Entidade {
  id: number
  nome: string
}

interface Opcao<T> {
  label: string
  value: T
}

// Paleta categórica (dark), validada para daltonismo – ordem fixa, nunca ciclada.
const PALETA = [
  '#3987e5',
  '#d95926',
  '#199e70',
  '#c98500',
  '#d55181',
  '#0ca30c',
  '#9085e9',
  '#e66767',
]
const COR_OUTROS = '#6b6b68'
const COR_ENTRADA = '#199e70'
const COR_SAIDA = '#d95926'
const COR_SALDO = '#3987e5'
const SUPERFICIE = '#222222'
const TEXTO = '#c3c2b7'
const TEXTO_FORTE = '#f0efec'
const GRADE = 'rgba(255,255,255,0.07)'
const MAX_SERIES = 8
const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})
const brlCurto = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 1,
})

@Component({
  selector: 'app-analise-gastos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ChartModule,
    CalendarModule,
    MultiSelectModule,
    SelectButtonModule,
    InputNumberModule,
    InputTextModule,
  ],
  templateUrl: './analise-gastos.component.html',
})
export class AnaliseGastosComponent implements OnInit {
  private movimentacaoService = inject(MovimentacaoService)
  private categoriaService = inject(CategoriaService)
  private responsavelService = inject(ResponsavelService)
  private cartaoService = inject(CartaoService)
  private tipoPagamentoService = inject(TipoPagamentoService)

  // ---------- dados mestres ----------
  categorias: Categoria[] = []
  responsaveis: Responsavel[] = []
  cartoes: Cartao[] = []
  tiposPagamento: TipoPagamento[] = []

  opcoesCategorias: Opcao<number>[] = []
  opcoesResponsaveis: Opcao<number>[] = []
  opcoesCartoes: Opcao<number>[] = []
  opcoesTipos: Opcao<number>[] = []

  // ---------- filtros ----------
  inicio: Date = this.addMeses(this.inicioDoMes(new Date()), -11)
  fim: Date = this.inicioDoMes(new Date())
  presetAtivo: string | null = '12m'
  presets: Opcao<string>[] = [
    { label: '3M', value: '3m' },
    { label: '6M', value: '6m' },
    { label: '12M', value: '12m' },
    { label: '24M', value: '24m' },
    { label: 'Ano atual', value: 'ano' },
    { label: 'Ano passado', value: 'anoPassado' },
  ]

  visao: Visao = 'saida'
  opcoesVisao: Opcao<Visao>[] = [
    { label: 'Gastos', value: 'saida' },
    { label: 'Entradas', value: 'entrada' },
  ]

  categoriasSel: number[] = []
  responsaveisSel: number[] = []
  cartoesSel: number[] = []
  tiposSel: number[] = []

  parcelamento: 'todas' | 'parceladas' | 'avista' = 'todas'
  opcoesParcelamento: Opcao<string>[] = [
    { label: 'Todas', value: 'todas' },
    { label: 'Parceladas', value: 'parceladas' },
    { label: 'À vista', value: 'avista' },
  ]

  fixas: 'todas' | 'fixas' | 'variaveis' = 'todas'
  opcoesFixas: Opcao<string>[] = [
    { label: 'Todas', value: 'todas' },
    { label: 'Fixas', value: 'fixas' },
    { label: 'Variáveis', value: 'variaveis' },
  ]

  busca = ''
  valorMin: number | null = null
  valorMax: number | null = null

  agrupamento: Dimensao = 'categoria'
  opcoesAgrupamento: Opcao<Dimensao>[] = [
    { label: 'Categoria', value: 'categoria' },
    { label: 'Responsável', value: 'responsavel' },
    { label: 'Cartão', value: 'cartao' },
    { label: 'Pagamento', value: 'tipoPagamento' },
  ]

  tipoEvolucao: 'bar' | 'line' = 'bar'
  opcoesTipoEvolucao: Opcao<string>[] = [
    { label: 'Barras', value: 'bar' },
    { label: 'Linhas', value: 'line' },
  ]

  tipoComposicao: 'bar' | 'line' = 'bar'
  composicaoPercentual = false

  filtrosAbertos = true

  // ---------- estado ----------
  carregando = false
  erroCarregamento = false
  private cache = new Map<string, MovAnalise[]>()
  private meses: string[] = []
  private dados: MovAnalise[] = []
  filtradas: MovAnalise[] = []
  private cores: Record<Dimensao, Map<number, string>> = {
    categoria: new Map(),
    responsavel: new Map(),
    cartao: new Map(),
    tipoPagamento: new Map(),
  }

  // ---------- KPIs ----------
  kpi = {
    totalSaidas: 0,
    totalEntradas: 0,
    saldo: 0,
    mediaMensal: 0,
    qtd: 0,
    ticketMedio: 0,
    maiorMes: { label: '-', valor: 0 },
    menorMes: { label: '-', valor: 0 },
    variacao: null as number | null,
    ultimoMes: { label: '-', valor: 0 },
    projecao: null as number | null,
    totalVisao: 0,
  }

  // ---------- gráficos ----------
  evolucaoData: any
  evolucaoOptions: any
  composicaoData: any
  composicaoOptions: any
  categoriaData: any
  responsavelData: any
  cartaoData: any
  tipoPagamentoData: any
  pizzaOptions: any
  pieOptions: any
  polarOptions: any
  barraHorizontalOptions: any
  acumuladoData: any
  acumuladoOptions: any
  diaSemanaData: any
  diaMesData: any
  barraSimplesOptions: any
  fixasData: any
  parceladoData: any
  radarData: any
  radarOptions: any
  ticketData: any
  ticketOptions: any

  // ---------- tabelas ----------
  topMovimentacoes: MovAnalise[] = []
  topDescricoes: { descricao: string; total: number; qtd: number }[] = []
  variacaoCategorias: {
    nome: string
    cor: string
    atual: number
    anterior: number
    media: number
    delta: number | null
  }[] = []
  tabelaMensal: {
    label: string
    entradas: number
    saidas: number
    saldo: number
    qtd: number
  }[] = []
  labelMesAtual = ''
  labelMesAnterior = ''

  ngOnInit() {
    forkJoin({
      categorias: this.categoriaService.getCategorias(),
      responsaveis: this.responsavelService.getResponsaveis(),
      cartoes: this.cartaoService.getCartoes(),
      tipos: this.tipoPagamentoService.getTiposPagamento(),
    }).subscribe({
      next: ({ categorias, responsaveis, cartoes, tipos }) => {
        this.categorias = categorias
        this.responsaveis = responsaveis
        this.cartoes = cartoes
        this.tiposPagamento = tipos
        this.montarOpcoesFiltros()
        this.carregar()
      },
      error: () => this.carregar(),
    })
  }

  // =====================================================================
  // Carregamento
  // =====================================================================

  aplicarPreset(preset: string | null) {
    if (!preset) return
    const hoje = this.inicioDoMes(new Date())
    this.presetAtivo = preset
    switch (preset) {
      case '3m':
      case '6m':
      case '12m':
      case '24m': {
        const n = parseInt(preset, 10)
        this.fim = hoje
        this.inicio = this.addMeses(hoje, -(n - 1))
        break
      }
      case 'ano':
        this.inicio = new Date(hoje.getFullYear(), 0, 1)
        this.fim = hoje
        break
      case 'anoPassado':
        this.inicio = new Date(hoje.getFullYear() - 1, 0, 1)
        this.fim = new Date(hoje.getFullYear() - 1, 11, 1)
        break
    }
    this.carregar()
  }

  onPeriodoManual() {
    this.presetAtivo = null
    if (this.inicio && this.fim && this.inicio > this.fim) {
      const t = this.inicio
      this.inicio = this.fim
      this.fim = t
    }
    this.carregar()
  }

  carregar() {
    if (!this.inicio || !this.fim) return
    this.meses = this.listarMeses(this.inicio, this.fim)

    const pendentes: { mes: string; entrada: boolean }[] = []
    for (const mes of this.meses) {
      for (const entrada of [false, true]) {
        if (!this.cache.has(this.chave(mes, entrada))) {
          pendentes.push({ mes, entrada })
        }
      }
    }

    if (pendentes.length === 0) {
      this.montarDados()
      return
    }

    this.carregando = true
    this.erroCarregamento = false

    from(pendentes)
      .pipe(
        mergeMap(({ mes, entrada }) => {
          const [ano, m] = mes.split('-').map(Number)
          return this.movimentacaoService
            .getMovimentacoesDoMes(m, ano, entrada)
            .pipe(
              map((movs) => ({ mes, entrada, movs, ok: true })),
              catchError(() => of({ mes, entrada, movs: [], ok: false }))
            )
        }, 6),
        toArray()
      )
      .subscribe((resultados) => {
        for (const r of resultados) {
          if (!r.ok) {
            this.erroCarregamento = true
            continue
          }
          this.cache.set(
            this.chave(r.mes, r.entrada),
            r.movs.map((mv) => ({ ...mv, mesRef: r.mes, entrada: r.entrada }))
          )
        }
        this.carregando = false
        this.montarDados()
      })
  }

  private montarDados() {
    const vistos = new Set<string>()
    this.dados = []
    for (const mes of this.meses) {
      for (const entrada of [false, true]) {
        for (const mv of this.cache.get(this.chave(mes, entrada)) ?? []) {
          const k = `${mv.id}-${mes}`
          if (vistos.has(k)) continue
          vistos.add(k)
          this.dados.push(mv)
        }
      }
    }
    this.atribuirCores()
    this.recalcular()
  }

  // =====================================================================
  // Filtros
  // =====================================================================

  private montarOpcoesFiltros() {
    this.opcoesCategorias = this.categorias
      .filter((c) => (this.visao === 'entrada' ? c.entrada : !c.entrada))
      .map((c) => ({ label: c.nome ?? '', value: c.id! }))
    this.opcoesResponsaveis = [
      { label: 'Sem responsável', value: 0 },
      ...this.responsaveis.map((r) => ({ label: r.nome, value: r.id })),
    ]
    this.opcoesCartoes = [
      { label: 'Sem cartão', value: 0 },
      ...this.cartoes.map((c) => ({ label: c.apelido, value: c.id })),
    ]
    this.opcoesTipos = this.tiposPagamento.map((t) => ({
      label: t.nome,
      value: t.id,
    }))
  }

  onVisaoChange() {
    // categorias de entrada e saída são disjuntas: limpa a seleção
    this.categoriasSel = []
    this.montarOpcoesFiltros()
    this.atribuirCores()
    this.recalcular()
  }

  get qtdFiltrosAtivos(): number {
    let n = 0
    if (this.categoriasSel.length) n++
    if (this.responsaveisSel.length) n++
    if (this.cartoesSel.length) n++
    if (this.tiposSel.length) n++
    if (this.parcelamento !== 'todas') n++
    if (this.fixas !== 'todas') n++
    if (this.busca.trim()) n++
    if (this.valorMin != null) n++
    if (this.valorMax != null) n++
    return n
  }

  limparFiltros() {
    this.categoriasSel = []
    this.responsaveisSel = []
    this.cartoesSel = []
    this.tiposSel = []
    this.parcelamento = 'todas'
    this.fixas = 'todas'
    this.busca = ''
    this.valorMin = null
    this.valorMax = null
    this.recalcular()
  }

  /** Clique numa fatia/barra alterna aquele item no filtro correspondente. */
  onSelecionarNoGrafico(dim: Dimensao, event: any, ids: number[]) {
    const idx = event?.element?.index
    if (idx == null) return
    const id = ids[idx]
    if (id == null || id < 0) return // "Outros"
    const alvo = this.selecaoDe(dim)
    const pos = alvo.indexOf(id)
    const novo = pos >= 0 ? alvo.filter((x) => x !== id) : [...alvo, id]
    this.setSelecao(dim, novo)
    this.recalcular()
  }

  private selecaoDe(dim: Dimensao): number[] {
    return {
      categoria: this.categoriasSel,
      responsavel: this.responsaveisSel,
      cartao: this.cartoesSel,
      tipoPagamento: this.tiposSel,
    }[dim]
  }

  private setSelecao(dim: Dimensao, valor: number[]) {
    if (dim === 'categoria') this.categoriasSel = valor
    if (dim === 'responsavel') this.responsaveisSel = valor
    if (dim === 'cartao') this.cartoesSel = valor
    if (dim === 'tipoPagamento') this.tiposSel = valor
  }

  /** Filtros que não dependem de entrada/saída. */
  private passaFiltros(m: MovAnalise, ignorarCategoria = false): boolean {
    if (
      !ignorarCategoria &&
      this.categoriasSel.length &&
      !this.categoriasSel.includes(m.categoria?.id ?? -1)
    )
      return false
    if (
      this.responsaveisSel.length &&
      !this.responsaveisSel.includes(m.responsavel?.id ?? 0)
    )
      return false
    if (this.cartoesSel.length && !this.cartoesSel.includes(m.cartao?.id ?? 0))
      return false
    if (
      this.tiposSel.length &&
      !this.tiposSel.includes(m.tipoPagamento?.id ?? -1)
    )
      return false
    const parcelada = !!m.parcela || m.numeroParcela != null
    if (this.parcelamento === 'parceladas' && !parcelada) return false
    if (this.parcelamento === 'avista' && parcelada) return false
    if (this.fixas === 'fixas' && !m.fixa) return false
    if (this.fixas === 'variaveis' && m.fixa) return false
    const busca = this.normalizar(this.busca.trim())
    if (busca && !this.normalizar(m.descricao ?? '').includes(busca))
      return false
    if (this.valorMin != null && m.valor < this.valorMin) return false
    if (this.valorMax != null && m.valor > this.valorMax) return false
    return true
  }

  // =====================================================================
  // Cálculos
  // =====================================================================

  recalcular() {
    const entradaVisao = this.visao === 'entrada'

    // Para o gráfico entradas x saídas, o filtro de categoria só vale para o
    // lado da visão atual (categorias de entrada e saída são disjuntas).
    const todasFiltradas = this.dados.filter((m) =>
      this.passaFiltros(m, m.entrada !== entradaVisao)
    )
    this.filtradas = todasFiltradas.filter((m) => m.entrada === entradaVisao)

    const labels = this.meses.map((m) => this.labelMes(m))
    const idxMes = new Map(this.meses.map((m, i) => [m, i]))

    const entradasMes = new Array(this.meses.length).fill(0)
    const saidasMes = new Array(this.meses.length).fill(0)
    const qtdMes = new Array(this.meses.length).fill(0)
    for (const m of todasFiltradas) {
      const i = idxMes.get(m.mesRef)!
      if (m.entrada) entradasMes[i] += m.valor
      else saidasMes[i] += m.valor
      if (m.entrada === entradaVisao) qtdMes[i]++
    }
    const visaoMes = entradaVisao ? entradasMes : saidasMes
    const saldoMes = entradasMes.map((e, i) => e - saidasMes[i])

    this.calcularKpis(entradasMes, saidasMes, visaoMes, labels)
    this.montarEvolucao(labels, entradasMes, saidasMes, saldoMes, visaoMes)
    this.montarComposicao(labels, idxMes)
    this.montarDistribuicoes()
    this.montarAcumulado(labels, visaoMes)
    this.montarCalendario()
    this.montarPerfis()
    this.montarRadar()
    this.montarTicket(labels, visaoMes, qtdMes)
    this.montarTabelas(labels, entradasMes, saidasMes, saldoMes, qtdMes)
  }

  private calcularKpis(
    entradasMes: number[],
    saidasMes: number[],
    visaoMes: number[],
    labels: string[]
  ) {
    const soma = (a: number[]) => a.reduce((s, v) => s + v, 0)
    const k = this.kpi
    k.totalEntradas = soma(entradasMes)
    k.totalSaidas = soma(saidasMes)
    k.saldo = k.totalEntradas - k.totalSaidas
    k.totalVisao = soma(visaoMes)
    k.mediaMensal = this.meses.length ? k.totalVisao / this.meses.length : 0
    k.qtd = this.filtradas.length
    k.ticketMedio = k.qtd ? k.totalVisao / k.qtd : 0

    let maior = -1
    let menor = -1
    visaoMes.forEach((v, i) => {
      if (maior < 0 || v > visaoMes[maior]) maior = i
      if (menor < 0 || v < visaoMes[menor]) menor = i
    })
    k.maiorMes =
      maior >= 0
        ? { label: labels[maior], valor: visaoMes[maior] }
        : { label: '-', valor: 0 }
    k.menorMes =
      menor >= 0
        ? { label: labels[menor], valor: visaoMes[menor] }
        : { label: '-', valor: 0 }

    const n = visaoMes.length
    k.ultimoMes =
      n > 0 ? { label: labels[n - 1], valor: visaoMes[n - 1] } : k.ultimoMes
    k.variacao =
      n >= 2 && visaoMes[n - 2] > 0
        ? ((visaoMes[n - 1] - visaoMes[n - 2]) / visaoMes[n - 2]) * 100
        : null

    // Projeção do mês corrente (somente se o último mês do período for o atual)
    const hoje = new Date()
    const mesAtual = this.chaveMes(hoje)
    if (n > 0 && this.meses[n - 1] === mesAtual) {
      const diasNoMes = new Date(
        hoje.getFullYear(),
        hoje.getMonth() + 1,
        0
      ).getDate()
      k.projecao = (visaoMes[n - 1] / hoje.getDate()) * diasNoMes
    } else {
      k.projecao = null
    }
  }

  private montarEvolucao(
    labels: string[],
    entradas: number[],
    saidas: number[],
    saldo: number[],
    visao: number[]
  ) {
    const mediaMovel = visao.map((_, i) => {
      if (i < 2) return null
      return (visao[i] + visao[i - 1] + visao[i - 2]) / 3
    })
    const tipo = this.tipoEvolucao
    const media = this.meses.length
      ? visao.reduce((s, v) => s + v, 0) / this.meses.length
      : 0

    this.evolucaoData = {
      labels,
      datasets: [
        {
          type: tipo,
          label: 'Entradas',
          data: entradas,
          ...this.estiloSerie(COR_ENTRADA, tipo),
          order: 2,
        },
        {
          type: tipo,
          label: 'Gastos',
          data: saidas,
          ...this.estiloSerie(COR_SAIDA, tipo),
          order: 2,
        },
        {
          type: 'line',
          label: 'Saldo',
          data: saldo,
          ...this.estiloSerie(COR_SALDO, 'line'),
          order: 1,
        },
        {
          type: 'line',
          label: `Média móvel 3M (${this.visao === 'entrada' ? 'entradas' : 'gastos'})`,
          data: mediaMovel,
          borderColor: TEXTO_FORTE,
          backgroundColor: TEXTO_FORTE,
          borderDash: [6, 4],
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          spanGaps: true,
          order: 0,
        },
        {
          type: 'line',
          label: 'Média do período',
          data: labels.map(() => media),
          borderColor: COR_OUTROS,
          borderDash: [2, 3],
          borderWidth: 1.5,
          pointRadius: 0,
          order: 0,
        },
      ],
    }
    this.evolucaoOptions = this.opcoesCartesianas()
  }

  private montarComposicao(labels: string[], idxMes: Map<string, number>) {
    const dim = this.agrupamento
    const { series, ids } = this.seriesPorDimensao(dim)
    const matriz = series.map(() => new Array(this.meses.length).fill(0))
    const posSerie = new Map(ids.map((id, i) => [id, i]))
    const idxOutros = ids.indexOf(-1)

    for (const m of this.filtradas) {
      const e = this.entidade(m, dim)
      const s = posSerie.get(e.id) ?? idxOutros
      if (s < 0) continue
      matriz[s][idxMes.get(m.mesRef)!] += m.valor
    }

    let dadosSeries = matriz
    if (this.composicaoPercentual) {
      const totais = labels.map((_, i) =>
        matriz.reduce((s, linha) => s + linha[i], 0)
      )
      dadosSeries = matriz.map((linha) =>
        linha.map((v, i) => (totais[i] ? (v / totais[i]) * 100 : 0))
      )
    }

    const tipo = this.tipoComposicao
    this.composicaoData = {
      labels,
      datasets: series.map((s, i) => ({
        label: s.nome,
        data: dadosSeries[i],
        backgroundColor: tipo === 'line' ? s.cor + '55' : s.cor,
        borderColor: tipo === 'line' ? s.cor : SUPERFICIE,
        borderWidth: tipo === 'line' ? 2 : 1,
        borderRadius: tipo === 'bar' ? 3 : 0,
        fill: tipo === 'line',
        tension: 0.3,
        pointRadius: tipo === 'line' ? 3 : 0,
        pointHoverRadius: 6,
      })),
    }

    const pct = this.composicaoPercentual
    const base = this.opcoesCartesianas(pct)
    base.scales.x.stacked = true
    base.scales.y.stacked = true
    if (pct) base.scales.y.max = 100
    this.composicaoOptions = base
  }

  private montarDistribuicoes() {
    const fazer = (dim: Dimensao) => {
      const totais = this.totaisPorDimensao(dim)
      return {
        ids: totais.map((t) => t.id),
        data: {
          labels: totais.map((t) => t.nome),
          datasets: [
            {
              data: totais.map((t) => t.total),
              backgroundColor: totais.map((t) => t.cor),
              borderColor: SUPERFICIE,
              borderWidth: 2,
              hoverOffset: 8,
            },
          ],
        },
      }
    }

    const cat = fazer('categoria')
    const resp = fazer('responsavel')
    const tipo = fazer('tipoPagamento')
    this.categoriaData = cat.data
    this.idsCategoria = cat.ids
    this.responsavelData = resp.data
    this.idsResponsavel = resp.ids
    this.tipoPagamentoData = tipo.data
    this.idsTipo = tipo.ids

    const cartoes = this.totaisPorDimensao('cartao')
    this.idsCartao = cartoes.map((t) => t.id)
    this.cartaoData = {
      labels: cartoes.map((t) => t.nome),
      datasets: [
        {
          label: this.visao === 'entrada' ? 'Entradas' : 'Gastos',
          data: cartoes.map((t) => t.total),
          backgroundColor: cartoes.map((t) => t.cor),
          borderRadius: 4,
          borderSkipped: false,
          barThickness: 18,
        },
      ],
    }

    this.pizzaOptions = {
      maintainAspectRatio: false,
      cutout: '58%',
      plugins: {
        legend: this.legenda('right'),
        tooltip: this.tooltipPizza(),
      },
      onHover: this.cursorMao,
    }
    this.pieOptions = { ...this.pizzaOptions, cutout: 0 }
    this.polarOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: this.legenda('right'),
        tooltip: this.tooltipPizza(),
      },
      scales: {
        r: {
          grid: { color: GRADE },
          angleLines: { color: GRADE },
          ticks: { display: false, backdropColor: 'transparent' },
        },
      },
      onHover: this.cursorMao,
    }
    const horizontal = this.opcoesCartesianas()
    horizontal.indexAxis = 'y'
    horizontal.plugins.legend = { display: false }
    horizontal.scales.x.ticks.callback = (v: number) => brlCurto.format(v)
    horizontal.scales.y.ticks.callback = function (this: any, v: number) {
      return this.getLabelForValue(v)
    }
    horizontal.scales.x.grid = { color: GRADE }
    horizontal.scales.y.grid = { display: false }
    horizontal.onHover = this.cursorMao
    this.barraHorizontalOptions = horizontal
  }

  idsCategoria: number[] = []
  idsResponsavel: number[] = []
  idsCartao: number[] = []
  idsTipo: number[] = []

  private montarAcumulado(labels: string[], visaoMes: number[]) {
    let acc = 0
    const acumulado = visaoMes.map((v) => (acc += v))
    const media = this.meses.length ? acc / this.meses.length : 0
    const ritmo = visaoMes.map((_, i) => media * (i + 1))

    this.acumuladoData = {
      labels,
      datasets: [
        {
          label: 'Acumulado',
          data: acumulado,
          borderColor: COR_SALDO,
          backgroundColor: COR_SALDO + '33',
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
        {
          label: 'Ritmo médio',
          data: ritmo,
          borderColor: COR_OUTROS,
          borderDash: [5, 4],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false,
        },
      ],
    }
    this.acumuladoOptions = this.opcoesCartesianas()
  }

  private montarCalendario() {
    const porSemana = new Array(7).fill(0)
    const porDia = new Array(31).fill(0)
    for (const m of this.filtradas) {
      const d = this.parseData(m.data)
      porSemana[d.getDay()] += m.valor
      porDia[d.getDate() - 1] += m.valor
    }
    const cor = this.visao === 'entrada' ? COR_ENTRADA : COR_SAIDA
    this.diaSemanaData = {
      labels: DIAS_SEMANA,
      datasets: [
        {
          label: this.visao === 'entrada' ? 'Entradas' : 'Gastos',
          data: porSemana,
          backgroundColor: cor,
          borderRadius: 4,
          borderSkipped: 'start',
        },
      ],
    }
    this.diaMesData = {
      labels: porDia.map((_, i) => String(i + 1)),
      datasets: [
        {
          label: this.visao === 'entrada' ? 'Entradas' : 'Gastos',
          data: porDia,
          backgroundColor: COR_SALDO,
          borderRadius: 3,
          borderSkipped: 'start',
        },
      ],
    }
    const opt = this.opcoesCartesianas()
    opt.plugins.legend = { display: false }
    this.barraSimplesOptions = opt
  }

  private montarPerfis() {
    let fixas = 0
    let variaveis = 0
    let parceladas = 0
    let avista = 0
    for (const m of this.filtradas) {
      if (m.fixa) fixas += m.valor
      else variaveis += m.valor
      if (m.parcela || m.numeroParcela != null) parceladas += m.valor
      else avista += m.valor
    }
    const donut = (labels: string[], valores: number[], cores: string[]) => ({
      labels,
      datasets: [
        {
          data: valores,
          backgroundColor: cores,
          borderColor: SUPERFICIE,
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    })
    this.fixasData = donut(
      ['Fixas', 'Variáveis'],
      [fixas, variaveis],
      [PALETA[6], PALETA[3]]
    )
    this.parceladoData = donut(
      ['Parceladas', 'À vista'],
      [parceladas, avista],
      [PALETA[4], PALETA[2]]
    )
  }

  /** Radar: perfil de categorias (top 6) por responsável (top 3). */
  private montarRadar() {
    const cats = this.totaisPorDimensao('categoria')
      .filter((c) => c.id >= 0)
      .slice(0, 6)
    const resps = this.totaisPorDimensao('responsavel')
      .filter((r) => r.id >= 0)
      .slice(0, 3)
    const matriz = resps.map(() => cats.map(() => 0))
    const posCat = new Map(cats.map((c, i) => [c.id, i]))
    const posResp = new Map(resps.map((r, i) => [r.id, i]))
    for (const m of this.filtradas) {
      const c = posCat.get(m.categoria?.id ?? -1)
      const r = posResp.get(m.responsavel?.id ?? 0)
      if (c == null || r == null) continue
      matriz[r][c] += m.valor
    }
    this.radarData = {
      labels: cats.map((c) => c.nome),
      datasets: resps.map((r, i) => ({
        label: r.nome,
        data: matriz[i],
        borderColor: r.cor,
        backgroundColor: r.cor + '33',
        pointBackgroundColor: r.cor,
        borderWidth: 2,
        pointRadius: 3,
      })),
    }
    this.radarOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: this.legenda('bottom'),
        tooltip: {
          callbacks: {
            label: (ctx: any) =>
              ` ${ctx.dataset.label}: ${brl.format(ctx.raw ?? 0)}`,
          },
        },
      },
      scales: {
        r: {
          grid: { color: GRADE },
          angleLines: { color: GRADE },
          pointLabels: { color: TEXTO, font: { size: 11 } },
          ticks: { display: false, backdropColor: 'transparent' },
        },
      },
    }
  }

  private montarTicket(labels: string[], visaoMes: number[], qtdMes: number[]) {
    this.ticketData = {
      labels,
      datasets: [
        {
          label: 'Ticket médio',
          data: visaoMes.map((v, i) => (qtdMes[i] ? v / qtdMes[i] : 0)),
          borderColor: PALETA[6],
          backgroundColor: PALETA[6],
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
      ],
    }
    const opt = this.opcoesCartesianas()
    opt.plugins.legend = { display: false }
    this.ticketOptions = opt
  }

  private montarTabelas(
    labels: string[],
    entradas: number[],
    saidas: number[],
    saldo: number[],
    qtd: number[]
  ) {
    this.topMovimentacoes = [...this.filtradas]
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 10)

    const porDescricao = new Map<
      string,
      { descricao: string; total: number; qtd: number }
    >()
    for (const m of this.filtradas) {
      const nome = (m.descricao || '(sem descrição)').trim()
      const chave = this.normalizar(nome)
      const item = porDescricao.get(chave) ?? {
        descricao: nome,
        total: 0,
        qtd: 0,
      }
      item.total += m.valor
      item.qtd++
      porDescricao.set(chave, item)
    }
    this.topDescricoes = [...porDescricao.values()]
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)

    // Variação por categoria: último mês vs anterior vs média do período
    const n = this.meses.length
    this.labelMesAtual = n ? labels[n - 1] : ''
    this.labelMesAnterior = n > 1 ? labels[n - 2] : ''
    const ultimo = this.meses[n - 1]
    const penultimo = this.meses[n - 2]
    const porCat = new Map<
      number,
      { nome: string; cor: string; atual: number; anterior: number; total: number }
    >()
    for (const m of this.filtradas) {
      const e = this.entidade(m, 'categoria')
      const item = porCat.get(e.id) ?? {
        nome: e.nome,
        cor: this.corDe('categoria', e.id),
        atual: 0,
        anterior: 0,
        total: 0,
      }
      item.total += m.valor
      if (m.mesRef === ultimo) item.atual += m.valor
      if (m.mesRef === penultimo) item.anterior += m.valor
      porCat.set(e.id, item)
    }
    this.variacaoCategorias = [...porCat.values()]
      .map((c) => ({
        nome: c.nome,
        cor: c.cor,
        atual: c.atual,
        anterior: c.anterior,
        media: n ? c.total / n : 0,
        delta: c.anterior > 0 ? ((c.atual - c.anterior) / c.anterior) * 100 : null,
      }))
      .sort((a, b) => b.atual - a.atual || b.media - a.media)

    this.tabelaMensal = labels
      .map((label, i) => ({
        label,
        entradas: entradas[i],
        saidas: saidas[i],
        saldo: saldo[i],
        qtd: qtd[i],
      }))
      .reverse()
  }

  // =====================================================================
  // Dimensões & cores
  // =====================================================================

  private entidade(m: Movimentacao, dim: Dimensao): Entidade {
    switch (dim) {
      case 'categoria':
        return { id: m.categoria?.id ?? -2, nome: m.categoria?.nome ?? '?' }
      case 'responsavel':
        return m.responsavel
          ? { id: m.responsavel.id, nome: m.responsavel.nome }
          : { id: 0, nome: 'Sem responsável' }
      case 'cartao':
        return m.cartao
          ? { id: m.cartao.id, nome: m.cartao.apelido }
          : { id: 0, nome: 'Sem cartão' }
      case 'tipoPagamento':
        return {
          id: m.tipoPagamento?.id ?? -2,
          nome: m.tipoPagamento?.nome ?? '?',
        }
    }
  }

  /**
   * A cor segue a entidade, não o ranking: é definida sobre todos os dados
   * carregados (sem filtros), então filtrar não repinta as séries.
   * Acima de 8 entidades, as menores viram "Outros".
   */
  private atribuirCores() {
    const entradaVisao = this.visao === 'entrada'
    const base = this.dados.filter((m) => m.entrada === entradaVisao)
    for (const dim of Object.keys(this.cores) as Dimensao[]) {
      const totais = new Map<number, number>()
      for (const m of base) {
        const e = this.entidade(m, dim)
        totais.set(e.id, (totais.get(e.id) ?? 0) + m.valor)
      }
      const ordenados = [...totais.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([id]) => id)
      // se cabem todos, ordena por id para estabilidade entre períodos
      const escolhidos =
        ordenados.length <= MAX_SERIES
          ? [...ordenados].sort((a, b) => a - b)
          : ordenados.slice(0, MAX_SERIES - 1)
      const mapa = new Map<number, string>()
      escolhidos.forEach((id, i) => mapa.set(id, PALETA[i]))
      this.cores[dim] = mapa
    }
  }

  private corDe(dim: Dimensao, id: number): string {
    return this.cores[dim].get(id) ?? COR_OUTROS
  }

  /** Totais filtrados por entidade, com itens sem cor agrupados em "Outros". */
  private totaisPorDimensao(
    dim: Dimensao
  ): { id: number; nome: string; total: number; cor: string }[] {
    const mapa = new Map<number, { id: number; nome: string; total: number }>()
    let outros = 0
    for (const m of this.filtradas) {
      const e = this.entidade(m, dim)
      if (!this.cores[dim].has(e.id)) {
        outros += m.valor
        continue
      }
      const item = mapa.get(e.id) ?? { ...e, total: 0 }
      item.total += m.valor
      mapa.set(e.id, item)
    }
    const lista = [...mapa.values()]
      .sort((a, b) => b.total - a.total)
      .map((i) => ({ ...i, cor: this.corDe(dim, i.id) }))
    if (outros > 0)
      lista.push({ id: -1, nome: 'Outros', total: outros, cor: COR_OUTROS })
    return lista
  }

  private seriesPorDimensao(dim: Dimensao) {
    const totais = this.totaisPorDimensao(dim)
    return {
      series: totais.map((t) => ({ nome: t.nome, cor: t.cor })),
      ids: totais.map((t) => t.id),
    }
  }

  // =====================================================================
  // Opções Chart.js
  // =====================================================================

  private estiloSerie(cor: string, tipo: 'bar' | 'line') {
    return tipo === 'bar'
      ? {
          backgroundColor: cor,
          borderColor: cor,
          borderRadius: 4,
          borderSkipped: 'start',
          maxBarThickness: 28,
        }
      : {
          backgroundColor: cor,
          borderColor: cor,
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 6,
          fill: false,
        }
  }

  private opcoesCartesianas(percentual = false): any {
    const formatar = (v: number) =>
      percentual ? `${v.toFixed(1)}%` : brl.format(v)
    return {
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: this.legenda('bottom'),
        tooltip: {
          backgroundColor: '#111',
          borderColor: '#444',
          borderWidth: 1,
          titleColor: TEXTO_FORTE,
          bodyColor: TEXTO,
          padding: 10,
          callbacks: {
            label: (ctx: any) =>
              ctx.raw == null
                ? null
                : ` ${ctx.dataset.label}: ${formatar(ctx.raw)}`,
          },
          filter: (item: any) => item.raw !== 0 || item.dataset.type === 'line',
        },
      },
      scales: {
        x: {
          ticks: { color: TEXTO },
          grid: { display: false },
          border: { color: '#444' },
        },
        y: {
          ticks: {
            color: TEXTO,
            callback: (v: number) =>
              percentual ? `${v}%` : brlCurto.format(v),
          },
          grid: { color: GRADE },
          border: { display: false },
        },
      },
    }
  }

  private legenda(posicao: 'bottom' | 'right') {
    return {
      position: posicao,
      labels: {
        color: TEXTO,
        usePointStyle: true,
        pointStyle: 'rectRounded',
        boxWidth: 10,
        boxHeight: 10,
        padding: 12,
        font: { size: 12 },
      },
    }
  }

  private tooltipPizza() {
    return {
      backgroundColor: '#111',
      borderColor: '#444',
      borderWidth: 1,
      titleColor: TEXTO_FORTE,
      bodyColor: TEXTO,
      padding: 10,
      callbacks: {
        label: (ctx: any) => {
          const total = (ctx.dataset.data as number[]).reduce(
            (s, v) => s + v,
            0
          )
          const pct = total ? ((ctx.raw / total) * 100).toFixed(1) : '0'
          return ` ${ctx.label}: ${brl.format(ctx.raw)} (${pct}%)`
        },
      },
    }
  }

  private cursorMao = (event: any, elementos: any[]) => {
    const alvo = event?.native?.target as HTMLElement | undefined
    if (alvo) alvo.style.cursor = elementos.length ? 'pointer' : 'default'
  }

  // =====================================================================
  // Utilitários
  // =====================================================================

  get temDados(): boolean {
    return this.filtradas.length > 0
  }

  formatarBRL(v: number): string {
    return brl.format(v ?? 0)
  }

  corCategoria(m: Movimentacao): string {
    return this.corDe('categoria', m.categoria?.id ?? -2)
  }

  labelMesRef(mesRef: string): string {
    return this.labelMes(mesRef)
  }

  private chave(mes: string, entrada: boolean) {
    return `${mes}|${entrada ? 'e' : 's'}`
  }

  private chaveMes(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  }

  private labelMes(chave: string) {
    const [ano, mes] = chave.split('-').map(Number)
    const nome = new Date(ano, mes - 1, 1)
      .toLocaleDateString('pt-BR', { month: 'short' })
      .replace('.', '')
    return `${nome}/${String(ano).slice(2)}`
  }

  private listarMeses(inicio: Date, fim: Date): string[] {
    const meses: string[] = []
    let d = this.inicioDoMes(inicio)
    const ultimo = this.inicioDoMes(fim)
    while (d <= ultimo && meses.length < 60) {
      meses.push(this.chaveMes(d))
      d = this.addMeses(d, 1)
    }
    return meses
  }

  private inicioDoMes(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), 1)
  }

  private addMeses(d: Date, n: number) {
    return new Date(d.getFullYear(), d.getMonth() + n, 1)
  }

  private parseData(data: string): Date {
    // "2026-03-15T00:00:00" -> usa a parte da data para evitar fuso
    const [a, m, d] = data.substring(0, 10).split('-').map(Number)
    return new Date(a, m - 1, d)
  }

  private normalizar(s: string) {
    return s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
  }
}
