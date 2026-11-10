import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { resumeRepository } from "@/lib/storage/resume-repository";
import { storageErrorMessage } from "@/lib/storage/errors";

export function useResumes() {
  const [attempt, setAttempt] = useState(0);
  const result = useLiveQuery(async () => {
    try {
      return { resumes: await resumeRepository.list(), error: null };
    } catch (error) {
      return { resumes: [], error: storageErrorMessage(error) };
    }
  }, [attempt]);
  return {
    resumes: result?.resumes ?? [],
    error: result?.error,
    loading: !result,
    retry: () => setAttempt((value) => value + 1),
  };
}
