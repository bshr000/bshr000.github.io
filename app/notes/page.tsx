import type { Metadata } from "next";
import { NotesArchive } from "@/components/notes/NotesArchive";
import { getNoteSummaries } from "@/lib/notes";
import { ArchiveHeader } from "@/components/ArchiveHeader";
export const metadata: Metadata = { title: "Notes", description: "A growing collection of learning notes and observations." };
export default function NotesPage() {
  const items = getNoteSummaries();
  return <>
    <ArchiveHeader title="Notes" statement="记录那些促使我思考与学习的片段。"
      english="Things I read. Ideas I reflect on. Notes I keep."
      description="A living archive of reading, learning, reflection, and thought."
      background="/images/headers/notes.png" />
    <NotesArchive notes={items} />
  </>;
}
