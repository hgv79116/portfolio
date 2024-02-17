interface RequireGradualHooks {
  onFullyRendered: () => void
}

export type GradualComponent = <T> (input: RequireGradualHooks & T) => JSX.Element | string