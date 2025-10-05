class LabelService {
  constructor() {
    this.labels = this.loadLabels()
  }

  loadLabels() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cosmozoom-labels')
      return saved ? JSON.parse(saved) : []
    }
    return []
  }

  saveLabels() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cosmozoom-labels', JSON.stringify(this.labels))
    }
  }

  getLabels() {
    return this.labels
  }

  addLabelAtPosition(text, position) {
    this.labels.push({ text, position })
    this.saveLabels()
  }

  deleteLabel(index) {
    this.labels.splice(index, 1)
    this.saveLabels()
  }

  editLabel(index, newText) {
    if (this.labels[index]) {
      this.labels[index].text = newText
      this.saveLabels()
    }
  }

  clearLabels() {
    this.labels = []
    this.saveLabels()
  }
}

export const labelService = new LabelService()