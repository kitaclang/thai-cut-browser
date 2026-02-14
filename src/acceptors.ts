export interface Acceptor {
  strOffset: number;
  isFinal: boolean;
  isError: boolean;
  tag: string;
  type: string;
  w: number;
  mw?: number;
  unk?: number;
  transit(ch: string): Acceptor;
}

export interface AcceptorCreator {
  createAcceptor(tag: Record<string, Acceptor>): Acceptor | null;
}

export interface AcceptorsInstance {
  creators: AcceptorCreator[];
  current: Acceptor[];
  tag: Record<string, Acceptor>;
  reset(): void;
  transit(ch: string): void;
  getFinalAcceptors(): Acceptor[];
}

export default function createAcceptors(): AcceptorsInstance {
  return {
    creators: [],
    current: [],
    tag: {},

    reset() {
      this.current = [];
      this.tag = {};
    },

    transit(ch: string) {
      this.creators.forEach((creator) => {
        const acceptor = creator.createAcceptor(this.tag);
        if (acceptor) {
          this.current.push(acceptor);
        }
      });

      const nextCurrent: Acceptor[] = [];
      this.tag = {};

      for (const currentAcceptor of this.current) {
        const acceptor = currentAcceptor.transit(ch);
        if (!acceptor.isError) {
          nextCurrent.push(acceptor);
          this.tag[acceptor.tag] = acceptor;
        }
      }

      this.current = nextCurrent;
    },

    getFinalAcceptors() {
      return this.current.filter((acceptor) => acceptor.isFinal);
    }
  };
}
