import { calculateEstimate } from '../src/domain/calculateEstimate'

const basePriceTables = {
  PRICES_NO_LENGTH: {
    'Kapping Gel': 85,
  },
  PRICES_WITH_LENGTH: {
    Acrilico: { 1: 58, 2: 64, 3: 70, 4: 80, 5: 92, 6: 105 },
  },
  DECORATION_PRICES: {
    Espejo: 8,
    Aurora: 12,
  },
  TONE_EXTRA_PRICE: 5,
  CHANGE_SHAPE_PRICE: 10,
  RETIRO_PRICES: {
    none: 0,
    acrilico: 20,
    gel: 18,
  },
  REPOSICION_PRICES: {
    none: 0,
    acrilico: 15,
    polygel: 17,
  },
  NON_COMBINABLE_DECORATIONS: {},
}

describe('calculateEstimate', () => {
  test('asigna pares gratis por orden de seleccion (casos A y B)', () => {
    const caseA = calculateEstimate(
      {
        techniqueKind: 'with-length',
        techniqueName: 'Acrilico',
        length: 3,
        decorationCounts: { Espejo: 2, Aurora: 1 },
        selectionOrder: ['Espejo', 'Aurora'],
        extraTones: 0,
        changeShape: false,
        retiroType: 'none',
        reposicionType: 'none',
      },
      basePriceTables,
    )

    expect(caseA.freeAllocation.Espejo).toBe(2)
    expect(caseA.freeAllocation.Aurora).toBe(0)
    expect(caseA.items.find((item) => item.name === 'Aurora')?.chargedQty).toBe(1)
    expect(caseA.total).toBe(82)

    const caseB = calculateEstimate(
      {
        techniqueKind: 'with-length',
        techniqueName: 'Acrilico',
        length: 3,
        decorationCounts: { Aurora: 1, Espejo: 2 },
        selectionOrder: ['Aurora', 'Espejo'],
        extraTones: 0,
        changeShape: false,
        retiroType: 'none',
        reposicionType: 'none',
      },
      basePriceTables,
    )

    expect(caseB.freeAllocation.Aurora).toBe(1)
    expect(caseB.freeAllocation.Espejo).toBe(1)
    expect(caseB.items.find((item) => item.name === 'Espejo')?.chargedQty).toBe(1)
    expect(caseB.total).toBe(78)
  })

  test('capea largo al maximo y acumula extras correctamente', () => {
    const result = calculateEstimate(
      {
        techniqueKind: 'with-length',
        techniqueName: 'Acrilico',
        length: 99,
        decorationCounts: { Espejo: 1, Aurora: 3 },
        selectionOrder: ['Espejo', 'Aurora'],
        extraTones: 2,
        changeShape: true,
        retiroType: 'gel',
        reposicionType: 'polygel',
      },
      basePriceTables,
    )

    expect(result.ui.effectiveLength).toBe(6)
    expect(result.total).toBe(184)
  })

  test('maneja precios faltantes con 0 sin mutar entradas', () => {
    const inputs = {
      techniqueKind: 'no-length',
      techniqueName: 'No existe',
      length: 2,
      decorationCounts: { EfectoX: 2 },
      selectionOrder: ['EfectoX'],
      extraTones: 1,
      changeShape: true,
      retiroType: 'acrilico',
      reposicionType: 'acrilico',
    }

    const priceTables = {
      PRICES_NO_LENGTH: {},
      PRICES_WITH_LENGTH: {},
      DECORATION_PRICES: {},
      TONE_EXTRA_PRICE: undefined,
      CHANGE_SHAPE_PRICE: undefined,
      RETIRO_PRICES: {},
      REPOSICION_PRICES: {},
      NON_COMBINABLE_DECORATIONS: {},
    }

    const snapshotBefore = JSON.stringify({ inputs, priceTables })
    const result = calculateEstimate(inputs, priceTables)
    const snapshotAfter = JSON.stringify({ inputs, priceTables })

    expect(result.total).toBe(0)
    expect(result.messages.some((message) => message.code === 'MISSING_TECHNIQUE_PRICE')).toBe(true)
    expect(result.messages.some((message) => message.code === 'MISSING_EXTRA_PRICE')).toBe(true)
    expect(snapshotAfter).toBe(snapshotBefore)
  })
})
