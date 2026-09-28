import type { Card } from '../data/logicTreeProblems'
import styles from './QuestionScreen.module.css'

type TreeViewProps = {
  parentLabel: string
  childCards: Card[]
  /** Optional caption above the tree (e.g. axis name). */
  caption?: string
  emptyHint?: string
}

/** Read-only parent → children tree used on scoring / explanation screens. */
export function TreeView({
  parentLabel,
  childCards,
  caption,
  emptyHint = 'カードなし',
}: TreeViewProps) {
  return (
    <section className={styles.tree} aria-label={caption ?? 'ロジックツリー'}>
      {caption && <h3 className={styles.treeCaption}>{caption}</h3>}
      <div className={styles.parentNode}>{parentLabel}</div>
      <div className={styles.branchLine} aria-hidden="true" />
      <div className={styles.children}>
        {childCards.length === 0 ? (
          <p className={styles.emptyHint}>{emptyHint}</p>
        ) : (
          childCards.map((card) => (
            <span key={card.id} className={styles.childCardStatic}>
              {card.label}
            </span>
          ))
        )}
      </div>
    </section>
  )
}
