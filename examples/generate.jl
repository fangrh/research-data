# Run through research-data run -- ... julia examples/generate.jl
# No new numerical solver: this is a tiny data-generation interface example.
using DelimitedFiles
destination = joinpath(ENV["RESEARCH_DATA_OUTPUT"], "julia-response.csv")
open(destination, "w") do io
    println(io, "voltage,current")
    writedlm(io, [0.0 0.0; 0.1 1e-6; 0.2 2e-6], ',')
end
