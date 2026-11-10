import Vision
import CoreImage
let a=CommandLine.arguments; let ci=CIImage(contentsOf:URL(fileURLWithPath:a[1]))!
let h=VNImageRequestHandler(ciImage:ci); let ctx=CIContext()
// orang satu per satu (person instance mask)
let rq=VNGeneratePersonInstanceMaskRequest()
try! h.perform([rq])
var n=0
if let r=rq.results?.first {
  for idx in r.allInstances {
    let buf=try! r.generateMaskedImage(ofInstances:IndexSet(integer:idx), from:h, croppedToInstancesExtent:false)
    try! ctx.writePNGRepresentation(of:CIImage(cvPixelBuffer:buf), to:URL(fileURLWithPath:"\(a[2])-o\(n).png"), format:CIFormat.RGBA8, colorSpace:CGColorSpace(name:CGColorSpace.sRGB)!)
    n+=1
  }
}
print(n)
