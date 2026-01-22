import { Injectable } from '@angular/core'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { DiaFiscal } from '../lib/types'

@Injectable({
    providedIn: 'root',
})
export class PdfExportService {
    constructor() { }

    /**
     * Exporta as movimentações para PDF
     * @param dias Array de dias fiscais com movimentações
     * @param total Total das movimentações
     * @param periodo Período filtrado (ex: "Janeiro/2026")
     */
    exportMovimentacoesPDF(
        dias: DiaFiscal[],
        total: number,
        periodo: string
    ): void {
        const doc = new jsPDF()

        // Configurações
        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        let yPosition = 20

        // Cabeçalho
        doc.setFontSize(18)
        doc.setFont('helvetica', 'bold')
        doc.text('MOVIMENTAÇÕES', pageWidth / 2, yPosition, {
            align: 'center',
        })

        yPosition += 10
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        doc.text(`Período: ${periodo}`, pageWidth / 2, yPosition, {
            align: 'center',
        })

        yPosition += 8
        doc.setFontSize(10)
        doc.text(
            `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
            pageWidth / 2,
            yPosition,
            { align: 'center' }
        )

        // Balanço Total
        yPosition += 12
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        const totalFormatado = this.formatarMoeda(total)
        doc.setTextColor(0, 0, 0) // Preto
        doc.text(
            `Balanço do Período: ${total >= 0 ? '' : '-'}${totalFormatado}`,
            pageWidth / 2,
            yPosition,
            { align: 'center' }
        )

        yPosition += 15

        // Iterar sobre os dias
        dias.forEach((dia, index) => {
            // Verificar se precisa de nova página
            if (yPosition > pageHeight - 60) {
                doc.addPage()
                yPosition = 20
            }

            // Preparar dados da tabela
            const tableData = dia.movimentacoes.map((mov) => {
                const valor = mov.valor
                const valorFormatado = this.formatarMoeda(Math.abs(valor))
                const dataMovimentacao = this.formatarDataCurta(mov.data)

                return [
                    dataMovimentacao,
                    mov.descricao || '-',
                    mov.categoria?.nome || '-',
                    mov.tipoPagamento?.nome || '-',
                    mov.responsavel?.nome || 'Eu',
                    mov.cartao?.apelido && mov.cartao.apelido !== 'Nenhum'
                        ? mov.cartao.apelido
                        : '-',
                    valorFormatado,
                ]
            })

            // Criar tabela
            autoTable(doc, {
                startY: yPosition,
                head: [
                    ['Data', 'Descrição', 'Categoria', 'Pagamento', 'Responsável', 'Cartão', 'Valor'],
                ],
                body: tableData,
                theme: 'striped',
                headStyles: {
                    fillColor: [63, 63, 70], // zinc-700
                    textColor: [255, 255, 255],
                    fontSize: 9,
                    fontStyle: 'bold',
                },
                bodyStyles: {
                    fontSize: 8,
                    textColor: [39, 39, 42], // zinc-800
                },
                alternateRowStyles: {
                    fillColor: [244, 244, 245], // zinc-100
                },
                columnStyles: {
                    0: { cellWidth: 20 }, // Data
                    1: { cellWidth: 40 }, // Descrição
                    2: { cellWidth: 25 }, // Categoria
                    3: { cellWidth: 22 }, // Pagamento
                    4: { cellWidth: 24 }, // Responsável
                    5: { cellWidth: 20 }, // Cartão
                    6: { cellWidth: 28, halign: 'right', fontStyle: 'bold' }, // Valor
                },
                didParseCell: (data) => {
                    // Manter todos os valores em preto
                    if (data.column.index === 6 && data.section === 'body') {
                        data.cell.styles.textColor = [0, 0, 0] // preto
                    }
                },
                margin: { left: 14, right: 14 },
            })

            // Atualizar posição Y após a tabela
            yPosition = (doc as any).lastAutoTable.finalY + 10
        })



        // Adicionar número de páginas no rodapé de cada página
        const pageCount = doc.getNumberOfPages()
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.setFontSize(8)
            doc.setFont('helvetica', 'normal')
            doc.setTextColor(128, 128, 128)
            doc.text(
                `Página ${i} de ${pageCount}`,
                pageWidth / 2,
                pageHeight - 10,
                { align: 'center' }
            )
        }

        // Salvar PDF
        const nomeArquivo = `movimentacoes_${periodo.replace(/\//g, '-')}_${new Date().getTime()}.pdf`
        doc.save(nomeArquivo)
    }

    /**
     * Formata um número como moeda brasileira
     */
    private formatarMoeda(valor: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(Math.abs(valor))
    }

    /**
     * Formata uma data para exibição curta (DD/MM/YYYY)
     */
    private formatarDataCurta(data: Date | string): string {
        let dataObj: Date

        if (typeof data === 'string') {
            // Corrigir timezone: adicionar horário para evitar problema de UTC
            const dateParts = data.split('-')
            if (dateParts.length === 3) {
                // Criar data no timezone local
                dataObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]))
            } else {
                dataObj = new Date(data)
            }
        } else {
            dataObj = data
        }

        return dataObj.toLocaleDateString('pt-BR')
    }
}
