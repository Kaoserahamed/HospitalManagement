"""Search domain (simple in-memory full-text search)."""

from __future__ import annotations


class SearchIndex:
    def __init__(self) -> None:
        self._documents: dict[str, dict] = {}

    def index(self, doc_id: str, content: str, metadata: dict | None = None) -> None:
        self._documents[doc_id] = {
            "id": doc_id,
            "content": content.lower(),
            "metadata": metadata or {},
        }

    def remove(self, doc_id: str) -> bool:
        return self._documents.pop(doc_id, None) is not None

    def search(self, query: str, limit: int = 20) -> list[dict]:
        terms = query.lower().split()
        results = []
        for doc in self._documents.values():
            content = doc["content"]
            score = sum(1 for term in terms if term in content)
            if score > 0:
                results.append({"id": doc["id"], "score": score, "metadata": doc["metadata"]})
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:limit]

    def count(self) -> int:
        return len(self._documents)

    def clear(self) -> None:
        self._documents.clear()


class SearchService:
    def __init__(self, index: SearchIndex | None = None) -> None:
        self.index = index or SearchIndex()

    def index_document(self, doc_id: str, content: str, metadata: dict | None = None) -> None:
        self.index.index(doc_id, content, metadata)

    def remove_document(self, doc_id: str) -> bool:
        return self.index.remove(doc_id)

    def search(self, query: str, limit: int = 20) -> list[dict]:
        if not query.strip():
            return []
        return self.index.search(query, limit=limit)

    def count(self) -> int:
        return self.index.count()

    def clear(self) -> None:
        self.index.clear()

    def rebuild(self, documents: list[dict]) -> int:
        self.clear()
        for doc in documents:
            self.index_document(doc["id"], doc.get("content", ""), doc.get("metadata"))
        return len(documents)

    def suggest(self, prefix: str, limit: int = 5) -> list[str]:
        prefix = prefix.lower()
        suggestions = set()
        for doc in self.index._documents.values():
            for word in doc["content"].split():
                if word.startswith(prefix):
                    suggestions.add(word)
        return sorted(suggestions)[:limit]
